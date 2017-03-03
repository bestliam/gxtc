//index.js

//获取应用实例
var app = getApp()
Page({
    data: {
        host: app.globalData.host,
        userInfo: {}
    },
    click_msg: function() {
        wx.navigateTo({
            url: '../msg/index/index'
        })
    },
    onLoad(){
      this.setData({
        userInfo:app.globalData.userInfo
      })
    }
})
