//获取应用实例
var app = getApp()

Page({
    data: {
        emailData: {},
        scrollHeight: 300,
        host: app.globalData.host,
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
            that.setData({
                emailData: emailData.data,
                emailID: option.EMAIL_ID
            })
        })
    },

    tapClick(e) {
        let that = this
        let fileType = e.currentTarget.dataset.type //获取文件类型
        let imgArr = ['png', 'jpg', 'gif']
        let imgFlag = imgArr.indexOf(fileType)
        let offArr = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx']
        let offFlag = offArr.indexOf(fileType)
        let url = 'oa/attach_show?' + e.currentTarget.dataset.url
        app.getHttpData(true, url, 'GET', '', function(attachData) {
            let openUrl = app.globalData.host + 'static/oa_attach/' + attachData.data
            if (offFlag != -1) {
                wx.downloadFile({
                    url: openUrl,
                    success: function(res) {
                        let filePath = res.tempFilePath
                        wx.openDocument({
                            filePath: filePath
                        })
                    }
                })
            } else if (imgFlag != -1) {
                wx.previewImage({
                    current: openUrl, // 当前显示图片的http链接
                    urls: [openUrl] // 需要预览的图片http链接列表
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '目前不支持在线浏览这种类型文件',

                })
            }
        })


    }
})
