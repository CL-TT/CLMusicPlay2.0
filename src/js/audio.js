/*
 * @Author: CL
 * @Date: 2020-06-13 23:21:06 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-15 01:28:15
 * 跟音乐相关的接口{
 *   1. 音乐的播放
 *   2. 音乐的暂停
 * } 
 */
;
(function (Player) {
  class AudioPlay {
    constructor() {
      this.status = false; //一开始音乐是暂停的状态
      this.audio = new Audio(); //创建出一个音乐Audio实例，
    }

    /**
     * 把音乐加载到页面上去
     */
    loadMusic(data) {
      this.audio.src = data.audio; //歌曲的路径
      this.audio.load(); //加载音乐
    }

    //播放音乐
    play(dom) {
      this.audio.play();
      this.status = true; //把状态变成播放状态
      $(dom).addClass('start'); //把暂停图标变成播放图标
    }

    //指定播放
    playTo(time) {
      this.audio.currentTime = time; //让歌曲调到指定的时间播放
    }

    //暂停音乐
    pause(dom) {
      this.audio.pause();
      this.status = false; //把状态变成暂停状态
      $(dom).removeClass('start'); //把播放图标变成暂停图标
    }

    //音乐播放完后续操作
    end(fn) {
      this.audio.onended = fn;
    }

    //改变状态的方法
    changeStatus(status) {
      this.status = status;
    }
  }
  Player.Audio = new AudioPlay(); //把这个实例对象抛出去 
})(window.Player || (window.Player = {}))