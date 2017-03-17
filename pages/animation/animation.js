// 开场动画页
//获取应用实例
var app = getApp()
Page({
    data: {},
    redirectTo(){
      if (app.globalData.userInfo.GH) {
          wx.switchTab({
              url: '/pages/person/index/index'
          })
      } else {
          wx.redirectTo({
              url: '../register/register?register=false'
          })
      }
    },
    onLoad() {
        wx.showToast({
            title: '加载中...',
            icon: 'loading',
            duration: 5000
        })
        let userInfo = wx.getStorageSync('userInfo') || [];
        //过期时间是半小时 1000*60*30
        let expire_in = Date.now() - userInfo.EXPIRE;
        if (expire_in < 7200000) {
            app.globalData.userInfo = userInfo
            this.redirectTo()
        } else {
            let that = this
                //调用登录接口
            app.getUserInfo(function(userInfo) {
                wx.hideToast()
                if (userInfo.errno > 0) {
                    wx.showModal({
                        title: '提示',
                        content: '与远程服务器通讯出现故障,请检查网络或稍后重试',
                        showCancel: false,
                    })
                } else {
                  that.redirectTo()
                }
            })
        }
    }
})
