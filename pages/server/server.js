//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
  },
click_msg:function () {
  wx.navigateTo({url:'./msg/msg'})
}
})
