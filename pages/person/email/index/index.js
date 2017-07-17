//获取应用实例
var app = getApp()
Page({
    data: {
        currentTab: 0,
        winWidth: 300,
        winHeight: 300,
        host: app.globalData.host,
        list: {},
        sendList: {},
        loadShow: true
    },
    getMoreData(that, url, tab) {
        let list = {}
        if (tab == 0) {
            list = that.data.list
        } else {
            list = that.data.sendList
        }
        app.getHttpData(false, url, 'GET', '', function(emailData) {
            if (emailData.data.data.length > 0) {
                for (var i = 0; i < emailData.data.data.length; i++) {
                    list.push(emailData.data.data[i])
                }
                if (tab == 0) {
                    that.setData({
                        list: list,
                        loadShow: false
                    })
                } else {
                    that.setData({
                        sendList: list,
                        loadShow: false
                    })
                }
            }
        })
    },
    lower() {
        let that = this
        let tab = that.data.currentTab
        let url = 'email/get_more_email?curriterms='
        if (tab == 0) {
            url = url + that.data.list.length
        } else {
            url = url + that.data.sendList.length
        }
        url = url + '&tab=' + tab
        that.getMoreData(that, url, tab)
    },
    onLoad() {
        let that = this
            //获取系统信息
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight,
                })
            }
        })
        let url = 'email/receive_email'
        app.getHttpData(true, url, 'GET', '', function(emailData) {
            if (emailData.data.data.length > 0) {
                that.setData({
                    list: emailData.data.data
                })
            }
        })
    },
    bindChange: function(e) {
        var that = this;
        if (e.detail.current == 1 && !that.data.sendList.length) {
            let url = 'oa/send_email_list'
            app.getHttpData(true, url, 'GET', '', function(emailData) {
              console.log(emailData.data)
                if (emailData.data.data.length > 0) {
                    that.setData({
                        sendList: emailData.data.data,
                        currentTab: e.detail.current
                    })
                }
            })
        } else {
            that.setData({
                currentTab: e.detail.current
            })
        }
    },
    //点击tab切换
    swichNav: function(e) {
        var that = this;
        if (that.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    }
})
