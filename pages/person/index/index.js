//index.js

//获取应用实例
var app = getApp()
Page({
    data: {
        host: app.globalData.host,
        userInfo: {},
        appList: {}
    },
    click_app(e) {
        switch (e.currentTarget.dataset.app) {
            case 'oa_email':
                console.log('邮件')
                break;
            case 'oa_message':
                wx.navigateTo({url: '../msg/index/index'})
                break;
            default:
                console.log('工作流')
                break;
        }
    },
    onLoad() {
        this.setData({
            userInfo: app.globalData.userInfo
        })
        let that = this
        app.getHttpData('wx/get_app_info', 'GET', '', function(data) {
            if (data.errno == 0) {
                that.setData({
                    appList: data.data
                })
            }
        })

    }

})
