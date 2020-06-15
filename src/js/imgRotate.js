/*
 * @Author: CL
 * @Date: 2020-06-14 01:32:19 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-14 02:04:55
 * 背景图片旋转模块{
 *   1. 背景图片的旋转
 *   2. 暂停旋转
 * } 
 */
;
(function ($, Player) {
  class ImgRotate {
    constructor() {
      this.singImg = $('.singbg img');
      this.timer = null;
    }

    //背景图片开始旋转
    startRotate(deg) {
      const AUDIO = Player.Audio;
      if (AUDIO.status) {
        //是播放的状态才可以旋转
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          deg = +deg + 0.2;
          this.singImg.css({
            'transform': 'rotate(' + deg + 'deg)'
          });
          this.singImg.data('rotate', deg); //把旋转的角度保存起来
        }, 1000 / 60)
      }
    }

    //背景图片暂停旋转
    stopRotate() {
      clearInterval(this.timer);
    }
  }

  Player.Rotate = new ImgRotate(); //把这个实例抛出去
})(window.Zepto, window.Player || (window.Player = {}))