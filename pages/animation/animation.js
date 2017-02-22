// 开场动画页
//获取应用实例
var app = getApp()
Page({
  data: {
    userInfo: {}
  },
  onLoad: function () {
    wx.showToast({
        title: '加载中...',
        icon: 'loading',
        duration: 5000
      })
    let that = this
    //调用登录接口
    app.getUserInfo(function (userInfo) {
      wx.hideToast()
      if (userInfo.errno >0) {
          wx.showModal({
          title: '提示',
          content: '远端服务器通讯故障，请稍后重试',
          showCancel: false,
        })
      }else{
        that.setData({
          userInfo: userInfo,
        })
        if (userInfo.register) {
          setTimeout(function(){wx.switchTab({ url: '../index/index' })},500)
        } else {
          wx.redirectTo({url:'../register/register?register=false'})
        }
        }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})
