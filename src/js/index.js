/*
 * @Author: CL
 * @Date: 2020-06-13 22:25:02 
 * @Last Modified by: CL
 * @Last Modified time: 2020-06-15 15:35:41
 * 主入口文件{
 *   1. 面向对象的编程方式
 * }
 */

;
(function ($, Player) {
  const DIV_WRAP = $('.wrap'); //获取到这个项目最外层的div

  //创建一个音乐播放器类， 所有的操作都在这个类中进行
  class MusicPlay {
    constructor(dom) {
      this.wrap = dom;
      this.musicList = []; //请求数据保存到这个数组
      this.indexObj = null;
    }

    //初始化方法
    init() {
      const MUSICURL = '../mock/data.json'; //请求地址
      this.getDom(); //获取所有DOM元素
      this.getData(MUSICURL); //获取音乐数据
    }

    //获取Dom元素
    getDom() {
      this.munesList = $('.munes div'); //底部菜单的所有div
      this.singImg = $('.singbg img'); //歌曲的背景图片
      this.close_div = $('.up-munes div'); //关闭切歌列表的div
      this.point = $('.point'); //小圆点
    }

    //请求数据
    getData(url) {
      var This = this;
      $.ajax({
        url,
        method: 'get',
        success(res) {
          This.musicList = res;
          This.indexObj = new Player.Index(This.musicList); //得到索引对象

          This.listChange(This.musicList); //列表切歌相关操作

          //数据请求完毕，就要加载音乐
          This.loadMusic(This.indexObj.nowIndex);

          This.bMunes(); //底部菜单相关操作

          This.progress(); //进度条部分
        },
        error(err) {
          console.log('请求错误' + err);
        }
      })
    }

    /**
     * 加载音乐{
     *   1.一进入应用，就要加载乐音， 背景图片， 歌曲信息
     * }
     */
    loadMusic(index) {
      Player.Render.init(this.musicList[index]); //渲染歌曲信息
      Player.Audio.loadMusic(this.musicList[index]); //加载音乐
      Player.Progress.init(this.musicList[index].duration); //进度条的那个时间渲染

      if (Player.Audio.status) { //如果是播放状态，就要播放音乐
        Player.Audio.play(); //播放音乐
        $(this.munesList[2]).addClass('start');
        Player.Rotate.startRotate(0); //让背景图片开始旋转
        Player.Progress.start(); //让时间和进度条运动起来
        if (Player.Progress.finish) {
          this.stopRotate(); //歌曲播放完，背景图片就停止旋转
        }
      }

      this.listControl.changeSing(index); //改变列表歌曲高亮显示
      this.currentIndex = index; //保存目前歌曲的索引
    }

    //底部菜单部分
    bMunes() {
      const THIS = this;
      const LIST = this.munesList;
      const AUDIO = Player.Audio; //获取到这个Audio实例

      //喜欢按键的事件监听
      $(LIST[0]).on('touchend', function () {
        $(this).hasClass('like-active') ? $(this).removeClass('like-active') : $(this).addClass('like-active');
      })

      //上一首歌的按键的事件监听
      $(LIST[1]).on('touchend', function () {
        AUDIO.changeStatus(true); //把状态变成播放状态
        let index = THIS.indexObj.prev();
        THIS.loadMusic(index);
      })

      //下一首歌的按键的事件监听
      $(LIST[3]).on('touchend', function () {
        AUDIO.changeStatus(true);
        let index = THIS.indexObj.next();
        THIS.loadMusic(index);
      })

      //开始播放和暂停播放事件监听
      $(LIST[2]).on('touchend', function () {
        if (AUDIO.status) {
          //播放状态， 就切换成暂停状态了
          AUDIO.pause(this); //音乐暂停播放
          Player.Rotate.stopRotate(); //背景图片暂停旋转
          Player.Progress.stop();
        } else {
          //暂停状态， 就切换成播放状态
          AUDIO.play(this); //播放音乐
          let deg = THIS.singImg.data('rotate') || 0;
          Player.Rotate.startRotate(deg); //背景图片开始旋转
          Player.Progress.start();
        }
      })

      //菜单按键事件监听
      $(LIST[4]).on('touchend', function () {
        THIS.listControl.listUp();
      })
    }

    //列表切歌部分
    listChange(data) {
      this.listControl = new Player.MunesList(data); //创建歌曲列表实例对象
      this.listControl.createList(); //创建歌曲列表

      //关闭按钮的点击事件
      this.close_div.on('touchend', () => {
        this.listControl.listDown();
      })

      //监听每一个列表歌曲的点击事件
      this.listControl.dds.forEach((item, index) => {
        $(item).on('touchend', () => {
          if (this.currentIndex === index && Player.Audio.status) {
            //如果点击的歌曲是目前索引对应的歌曲，并且状态是播放的
            Player.Audio.pause(); //那么就暂停播放
            Player.Rotate.stopRotate(); //背景图片暂停旋转
            return;
          }
          Player.Audio.changeStatus(true);
          this.indexObj.nowIndex = index; //目前歌曲的索引值要改变
          this.loadMusic(index); //加载音乐
          this.listControl.listDown(); //列表隐藏
        })
      })
    }

    //进度条部分
    progress() {
      const THIS = this;
      //拖拽按下
      Player.Progress.dragStart = function () {
        //当进行拖拽时，停止计时
        this.stop();
      }

      //拖拽移动
      Player.Progress.dragMove = function (pre) {
        this.update(pre, true);
      }

      //拖拽抬起
      Player.Progress.dragEnd = function (pre, time) {
        this.start(pre, false);
        Player.Audio.playTo(time); //让歌曲跳到指定时间
        Player.Audio.play(THIS.munesList[2]) //如果一开始是暂停状态的话要让音乐播放
        let deg = THIS.singImg.data('rotate') || 0;
        Player.Rotate.startRotate(deg); //让背景图片旋转起来
      }

      Player.Progress.pointDrag(this.point);
    }
  }

  //创建出实例
  const MUSICPLAY = new MusicPlay(DIV_WRAP);

  //执行初始化方法
  MUSICPLAY.init();
})(window.Zepto, window.Player)