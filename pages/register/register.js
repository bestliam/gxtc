//index.js
//获取应用实例
var app = getApp()
Page({
  data: {userInfo: {}},
  //事件处理函数
  formSubmit: function (e) {

    var that = this
    if (e.detail.value.sfzh == "") {
      wx.showModal({
        title: '提示',
        content: '请输入身份证号后点击确认绑定',
        showCancel: false,
      })
    } else {
      //进行用户绑定
      let access_token = wx.getStorageSync('access_token')
      let header = {access_token:access_token}
      let data = { sfzh: e.detail.value.sfzh}
      //调用接口
      let url = app.globalData.hostName + 'wx/wx_register'
      app.getHttpData(true,url,'POST',header,data,function(res){
        if (res.errno > 0) {
          wx.showModal({
            title: '提示',
            content: '身份证号不存在，请确认后重新进行身份绑定',
            showCancel: false,
          })
        } else{

            // 注册成功后重新调用下获取用户信息接口
            app.globalData.userInfo.register = true
            wx.switchTab({url:'../index/index'})

        }
      })

    }
  },
  onLoad: function (options) {
    if(!options.register){
      wx.switchTab({url: '../index/index'})
    }
  }
})
