/*
 * @Author: CL 
 * @Date: 2020-06-13 23:34:06 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2020-06-13 23:42:33
 * 索引模块{
 *   1. 记录着所有操作的索引值
 * } 
 */
;
(function (Player) {
  class CurrentIndex {
    constructor(data) {
      this.nowIndex = 0; //当前索引
      this.dataLength = data.length; //数据的总长度
    }

    //上一个索引
    prev() {
      return this.getIndex(-1);
    }

    //下一个索引
    next() {
      return this.getIndex(1);
    }

    //获取索引
    getIndex(value) {
      //当前索引为0， 上一个索引-1， 长度为6， 
      //0 - 1 + 6 = 5  5 % 6 = 5  所以正确
      return this.nowIndex = (this.nowIndex + value + this.dataLength) % this.dataLength;
    }
  }

  Player.Index = CurrentIndex; //把这个类抛出去
})(window.Player || (window.Player = {}))