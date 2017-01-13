//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    let sfzh = wx.getStorageSync('sfzh')
    if (sfzh) {
      wx.redirectTo({
        url: './pages/register/register'
      })
    } else {
      //获取远端数据，查看是否已经进行绑定
      let url = this.globalData.hostName + 'wx_register'
      let appid = this.globalData.appid
      //调用登录接口
      wx.login({
        success: function (data) {
          wx.getUserInfo({
            success: function (res) {
              //发送网络请求
              wx.request({
                url: url,
                data: {
                  code: data.code,
                  appid: appid
                },
                method: 'POST',
                success: function (res) {
                  if (res.data.errno == 20002) {
                    //未进行绑定，导航到绑定页面
                    // wx.redirectTo({
                    //   url: './pages/logs/logs'
                    // })
                  }
                }
              })
            }
          })
        }
      })
    }
  },

  /**
   * 调用远端服务器api接口方法
   * url 远端api的地址
   * method 调用方式 GET/POST/PUT 大写
   * data 发送给api的数据
   * cb callback函数，返回数据
   * 调用方式  getHttpDa
   * */
  getHttpData: function (url, method, data, cb) {
    wx.request({
      url: url,
      data: data,
      header: {
        'content-type': 'application/json'
      },
      method: method,
      success: function (res) {
        cb(res.data);
      }
    })
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function (data) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              that.globalData.userInfo.code = data.code
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    hostName: 'http://210.36.81.76:8360/api/',
    appid: 'wxc409e8fede7211b2'
  }
})