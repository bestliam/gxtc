//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
  },

  /**
   * 调用远端服务器api接口方法
   * url 远端api的地址
   * method 调用方式 GET/POST/PUT 大写
   * data 发送给api的数据
   * cb callback函数，返回数据
   * 调用方式  getHttpDa
   * */
  getHttpData: function (url, method, header, data, cb) {
    let headerData = header || { 'content-type': 'application/json' }
    wx.request({
      url: url,
      data: data,
      header: headerData,
      method: method,
      success: function (res) {
        cb(res.data);
      },
      fail:function () {
        console.log("远程数据连接不上")
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
              let url = that.globalData.hostName + 'wx/get_access_token'
              let postData = {
                code: data.code,
                tntid: that.globalData.tntid
              }
              //查看本地是否存在旧的access_token，如果存在则一起发送到服务器去删除缓存数据，并生成新的access_token
              let access_token = wx.getStorageSync("access_token")
              let headerData = { 'content-type': 'application/json' }
              if (access_token) {
                headerData={access_token:access_token}
              }
              //调用远端api，获取access_token并写入缓存
              wx.request({
                url: url,
                data: postData,
                header: headerData,
                method: 'POST',
                success: function (resData) {
                  if (resData.data.data.register) {
                    that.globalData.userInfo.register = resData.data.data.register
                    }
                  //写入缓存
                  if (resData.data.data.access_token) {
                    wx.setStorageSync('access_token', resData.data.data.access_token)
                  }

                  typeof cb == "function" && cb(that.globalData.userInfo)
                },
                fail:function(){
                  cb({errno:10007,errmsg:'远程服务器不可用'})
                }
              })
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    hostName: 'http://127.0.0.1:8360/api/',
    tntid: 'tntc409e8fede7211b2'
  }
})
