//获取应用实例
var app = getApp()

Page({
  data:{
    content:{}
  },
  onLoad(option){
    let that = this
    let url = 'oa/read_email?EMAIL_ID=' + option.EMAIL_ID
    app.getHttpData(true, url, 'GET', '', function(emailData) {
        that.setData({
          content:emailData.data
        })
    })
  }
})
