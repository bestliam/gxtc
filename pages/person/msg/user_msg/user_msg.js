var app = getApp()
var getList = function(that) {
    let url = 'oa/get_dialog_list?fromuid=' + that.data.fromUid
        // let url = 'oa/get_dialog_list?fromuid=7'
    app.getHttpData(url, 'GET', '', function(msgData) {
        if (msgData.errno == 0) {
            var list = that.data.content;
            for (var i = 0; i < msgData.data.data.length; i++) {
                if (msgData.data.data[i].url) {
                  msgData.data.data[i].url = that.data.oaServer+msgData.data.data[i].url
                }
                list.unshift(msgData.data.data[i])
            }
            let zb = msgData.data.data.length - 1
            that.setData({
                oaServer: msgData.data.oa_server,
                content: list,
                lastMsgID: msgData.data.data[9].q_id
            })
            if (that.data.scrollTop == 0) {
                that.setData({
                    scrollTop: 200000
                })
            }
        }
    })
}
Page({
    data: {
        host: app.globalData.host,
        content: [],
        scrollHeight: 300,
        btnShow: false,
        imgWidth: 300,
        toView: 'aa',
        btnShowHeight: 300,
        btnShowWidth: 300,
        scrollTop: 0,
        oaServer: 'http://127.0.0.1/',
        // userInfo: {},
        fromUid: '',
        loadingShow: false,
        loadingMsg: '数据加载中...',
        lastMsgID: '',
    },
    refresh: function(event) {
        var that = this
            //  该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
        that.setData({
            loadingShow: true,
            // scrollTop: 0
        })
        let url = 'oa/get_old?fromuid=' + that.data.fromUid + '&MSG_ID=' + that.data.lastMsgID
        var list = that.data.content
        app.getHttpData(url, 'GET', '', function(msgData) {
            console.log(msgData.data)
            for (var i = 0; i < msgData.data.data.length; i++) {
                list.unshift(msgData.data.data[i]);
            }
            that.setData({
                loadingShow: false,
                content: list,
                lastMsgID: msgData.data.data[9].q_id,
                scrollTop: that.data.scrollTop
            })
        })
    },
    onLoad: function(options) {
        var that = this
            //设置页面参数
        wx.setNavigationBarTitle({
            title: options.fromname
        })
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    fromUid: options.fromuid,
                    scrollHeight: res.windowHeight - 50,
                    imgWidth: res.windowWidth - 150,
                    btnShowHeight: res.windowHeight,
                    btnShowWidth: res.windowWidth,
                    userInfo: app.globalData.userInfo,
                    btnShow: false
                })
            }
        })
    },
    onShow: function() {
        //加载数据
        var that = this
        getList(that)
    },
    tapShow: function(e) {
        this.setData({
            btnShow: true,
            toView: 'text4'
        })
    },
    tapHide: function(e) {
        this.setData({
            btnShow: false
                // toView: 'bottom'
        })
    },
    tapIcon(e) {
        let that = this
        wx.chooseImage({
            success: function(res) {
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: app.globalData.host + 'api/oa/upload_file', //仅为示例，非真实的接口地址
                    header: {
                        'access_token': app.globalData.userInfo.ACCESS_TOKEN
                    },
                    filePath: tempFilePaths[0],
                    name: 'ATTACHMENT',
                    formData: {
                        UPLOAD_MODE: '1',
                        DEST_UID: that.data.fromUid,
                        MSG_CATE: 'image',
                        P_VER: '6', //对应MSG_TYPE 7定义为微信小程序发送来
                        TYPE: 'mobile'
                    },
                    success: function(res) {
                        // getList(that, that.data.uid)
                        console.log(res)
                        let newMsg = {
                            q_id: 99999999,
                            to_uid: that.data.fromUid,
                            q_uid: app.globalData.userInfo.UID,
                            send_time: '刚刚',
                            msg_from:'1',
                            content: res.data.content,
                            url: tempFilePaths[0],
                            msg_cate: 'image'
                        }
                        let newMsgData = that.data.content
                        newMsgData.push(newMsg)
                            // console.log(that.data.content)
                        that.setData({
                            btnShow: false,
                            scrollTop:that.data.scrollTop+10000000,
                            content: newMsgData
                        })

                    }
                })
            }
        })
    },
    previewImage(e) {
        wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [e.target.dataset.url] // 需要预览的图片http链接列表
        })
    }
})
