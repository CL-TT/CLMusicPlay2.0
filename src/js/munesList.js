/*
 * @Author: CL
 * @Date: 2020-06-14 12:04:36 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-14 15:16:59
 * 上拉歌曲菜单模块{
 *   1. 点击菜单的歌曲能切歌
 *   2. 正在播放的歌曲高亮显示
 * }
 */
;
(function ($, Player) {
  class MunesList {
    constructor(data) {
      this.dl = $('.up-munes dl');
      this.up_munes = $('.up-munes');
      this.data = data; //接受传过来的数据
    }

    //创建歌曲列表的方法
    createList() {
      this.data.forEach((item, index) => {
        let dd = $('<dd></dd>').text(item.song).appendTo(this.dl);
        index === 0 ? dd.addClass('active') : '';
      })
      this.dds = $('.up-munes dd');
    }

    //让列表上去
    listUp() {
      this.up_munes.css({
        'transform': 'translateY(0vh)',
        'opacity': 1,
        'transition': '1s'
      })
    }

    //让列表下去
    listDown() {
      this.up_munes.css({
        'transform': 'translateY(33vh)',
        'opacity': 0,
        'transition': '1s'
      })
    }

    //改变活跃状态
    changeSing(index) {
      this.dds.forEach((item, index) => {
        $(item).removeClass('active');
      })
      $(this.dds[index]).addClass('active');
    }

  }

  Player.MunesList = MunesList; //抛出这个类
})(window.Zepto, window.Player || (window.Player = {}))