/*
 * @Author: CL
 * @Date: 2020-06-14 19:04:39 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-15 01:27:34
 * 进度条模块{
 *   1. 时刻显示歌曲的播放时间和总时间
 *   2. 进度条拖拽能影响歌曲的播放进度
 * } 
 */
;
(function ($, Player) {
  class Progress {
    constructor() {
      this.startTime = 0;
      this.lastTime = 0; //记录上一次时间
      this.timer = null; //定时器
      this.startPageX = 0;
      this.startLeft = 0;
      this.disX = 0;
      this.dragPre = 0; //拖拽的百分比
    }

    //初始化方法
    init(time) {
      this.startTime = 0;
      this.lastTime = 0;
      this.time = time;
      this.getDom();
      this.renderDom(this.startTime, this.time);
    }

    //获取元素
    getDom() {
      this.startTime_div = $('.start-time');
      this.allTime_div = $('.all-time');
      this.fontBg = $('.fontbg');
      this.backBg = $('.backbg');
      this.bgLength = this.backBg.width() - 5;
      this.point_div = $('.point'); //小圆点
      this.munesList = $('.munes div');
    }

    //开始移动
    start(pre, isDrag) {
      this.lastTime = pre ? pre : this.lastTime;
      this.startTime = new Date().getTime(); //记录开始的时间
      clearInterval(this.timer); //先要清除一下定时器
      this.timer = setInterval(() => {
        let curTime = new Date().getTime();
        let timeGo = Math.round((curTime - this.startTime) / 1000);
        let pre = this.getPre(timeGo) + this.lastTime; //得到时间比例
        pre = this.isOverSize(pre); //歌曲是否播放完
        this.update(pre, isDrag); //更新时间
      }, 1000)
    }

    //更新时间的方法
    update(pre, isDrag) {
      var timeGo = Math.round(this.time * pre); //经过了多长时间
      this.renderDom(timeGo, this.time); //更新页面
      this.proMove(pre); //更新进度条
      if (isDrag) {
        //如果有拖拽，那么就不让小圆点自己动了
        return;
      }
      this.pointMove(pre); //更新小圆点的位置
    }

    //停止运动的方法
    stop() {
      clearInterval(this.timer);
      let endTime = new Date().getTime(); //记录暂停时的时间
      this.lastTime += (endTime - this.startTime) / (this.time * 1000); //记录上一次时间的百分比
    }

    //进度条移动,根据百分比来进行移动
    proMove(pre) {
      pre = pre * 100;
      this.fontBg.css({
        'width': pre + '%'
      })
    }

    //小圆点开始移动
    pointMove(pre) {
      var dis = this.bgLength * pre;
      this.point_div.css({
        'transform': "translateX(" + dis + "px)"
      })
    }

    //时间格式化方法 200s => 03:30
    timeFormat(time) {
      const M = (Math.floor(time / 60) + "").padStart(2, 0); //分钟
      const S = ((time % 60) + "").padStart(2, 0); //秒
      return M + ":" + S;
    }

    //渲染Dom的元素
    renderDom(start, all) {
      let startTime = this.timeFormat(start);
      let allTime = this.timeFormat(all);
      this.startTime_div.text(startTime);
      this.allTime_div.text(allTime);
    }

    //根据时间求出比例
    getPre(curTime) {
      return (curTime / this.time);
    }

    //判断比例有没有越界
    isOverSize(pre) {
      pre = pre * 100;
      if (pre < 0 || pre >= 99.5) {
        //如果歌曲放完了，那么就清除定时器
        clearInterval(this.timer);
        Player.Rotate.stopRotate(); //并且图片停止旋转
        $(this.munesList[2]).removeClass('start');
        return 1;
      }
      return pre / 100;
    }

    //小圆点拖拽
    pointDrag(dom) {
      dom.on('touchstart', (ev) => {
        this.startPageX = ev.changedTouches[0].pageX; //第一次手指点击的位置
        this.startLeft = parseFloat(dom.css('transform').split('(')[1]); //['translateX','0)']
        //对外暴露拖拽开始的方法，按下的时候要做的事情就交给用户，通过这个方法去添加
        this.dragStart && this.dragStart();
      });

      dom.on('touchmove', (ev) => {
        this.disX = ev.changedTouches[0].pageX - this.startPageX;
        let L = this.startLeft + this.disX;
        if (L < 0) {
          L = 0;
        } else if (L > this.bgLength) {
          L = this.bgLength;
        }
        dom.css({
          'transform': 'translateX(' + L + 'px)'
        })
        this.dragPre = L / this.bgLength; //得到拖拽的比例
        this.dragMove && this.dragMove(this.dragPre);
      });

      dom.on('touchend', (ev) => {
        let time = this.dragPre * this.time;
        this.dragEnd && this.dragEnd(this.dragPre, time);
      })
    }

  }

  Player.Progress = new Progress();
})(window.Zepto, window.Player || (window.Player = {}))