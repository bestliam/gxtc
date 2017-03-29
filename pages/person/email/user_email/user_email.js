//获取应用实例
var app = getApp()

Page({
    data: {
        emailData: {},
        scrollHeight: 300,
        host: app.globalData.host,
        btnShow: false,
        url: '',
        emailID: 0
    },
    sendEmail(e) {
        let action = e.currentTarget.dataset.action
        let emailData = this.data.emailData
            //附件信息太大，无法传递给下一页面
        delete emailData.attachment
        wx.navigateTo({
            url: '../send_email/send_email?EMAIL_ID=' + this.data.emailID + '&ACTION=' + action + '&EMAIL_DATA=' + JSON.stringify(emailData)
        })
    },
    delEmail() {
        let that = this
        wx.showModal({
            title: '删除提示',
            content: '确认删除该邮件吗？',
            success: function(res) {
                if (res.confirm) {
                    let url = 'oa/del_email?EMAIL_ID=' + that.data.emailID
                    app.getHttpData(false, url, 'GET', '', function(res) {
                        if (res.data.status == 'ok') {
                            // 更新上一页数据
                            let pages = getCurrentPages()
                            pages[1].onLoad()
                            wx.navigateBack()
                        }
                    })
                }
            }
        })
    },
    onShow() {
        let that = this
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    scrollHeight: res.windowHeight - 190,
                })
            }
        })
    },
    onLoad(option) {
        let that = this
        let url = 'oa/read_email?EMAIL_ID=' + option.EMAIL_ID
        app.getHttpData(true, url, 'GET', '', function(emailData) {
            console.log(emailData)
            that.setData({
                emailData: emailData.data,
                emailID: option.EMAIL_ID
            })
        })
    },
    cancleDown(e) {
        this.setData({
            btnShow: false
        })
    },
    downloadFile(e) {
        let that = this
        let url = 'http://127.0.0.1:8360/api/oa/attach_show?' + this.data.url
        console.log(url)
        wx.downloadFile({
            url: url, //仅为示例，并非真实的资源
            success: function(res) {
                wx.saveFile({
                    tempFilePath: res.tempFilePath,
                    success: function(res2) {
                        that.setData({
                            btnShow: false
                        })
                        wx.showToast({
                            title: '文件下载成功',
                            icon: 'success',
                            duration: 1000
                        })
                    }
                })
            }
        })
    },
    tapClick(e) {
        let that = this
        let url = app.globalData.host + 'api/oa/attach_show?' + e.currentTarget.dataset.url
        console.log(url)
        wx.downloadFile({
                header: {
                    'access_token': app.globalData.userInfo.ACCESS_TOKEN
                },
                url: url,
                success: function(res) {
                    var filePath = res.tempFilePath
                    wx.openDocument({
                        filePath: filePath,
                        success: function(res) {
                            console.log('打开文档成功')
                        }
                    })
                }
            })
            // this.setData({
            //     btnShow: true,
            //     url: e.currentTarget.dataset.url
            // })
    }
})
