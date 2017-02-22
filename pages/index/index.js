//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
     imgUrls: [],
     news:[],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
  },
  //事件处理函数
  onLoad: function () {
    var that = this
    let access_token = wx.getStorageSync('access_token')
      let header = {access_token:access_token}
    let url = app.globalData.hostName + 'index/index'
    app.getHttpData(url,'GET',header,'',function(res){
        that.setData({
            imgUrls:res.data.swiperImgs,
            news:res.data.news
        })
    })
  }
})
