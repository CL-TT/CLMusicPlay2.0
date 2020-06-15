/*
 * @Author: CL
 * @Date: 2020-06-13 22:41:22 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-14 01:15:35
 * 渲染模块{
 *   1. 渲染歌曲的背景图片
 *   2. 渲染歌曲的主体信息
 *   3. 渲染歌曲是否被喜欢
 * } 
 */
;
(function ($, Player) {
  class Render {
    constructor() {

    }

    /**
     * 初始化函数
     * @param {*} data 每一条音乐数据 
     */
    init(data) {
      this.getDom();
      this.renderImage(data.image);
      this.renderWords(data);
      this.renderIsLike(data.isLike);
    }

    //获取dom元素方法
    getDom() {
      this.singImg = $('.singbg img'); //歌曲背景图片
      this.singTitle = $('.singwords > h1'); //歌曲名称
      this.singSinger = $('.singwords > h3'); //歌曲作者
      this.singWords = $('.singwords > span'); //歌曲信息
      this.munesList = $('.munes div'); //底部菜单
    }

    //渲染背景图片
    renderImage(image) {
      Player.blurImg(image); //背景高斯模糊
      $(this.singImg).prop('src', image); //把背景图片给图片元素
    }

    //渲染歌曲信息
    renderWords(data) {
      this.singTitle.text(data.song);
      this.singSinger.text(data.singer);
      this.singWords.text(data.album);
    }

    //渲染是否喜欢这首歌曲
    renderIsLike(isLike) {
      isLike ? $(this.munesList[0]).addClass('like-active') : '';
    }
  }

  Player.Render = new Render(); //把这个实例对象抛出去
})(window.Zepto, window.Player || (window.Player = {}))