var app = getApp()
var getList = function(that, url) {
    if (that.data.lastPage) {
        that.setData({
            loadingShow: true,
            loadingMsg: '已无更多数据',
        })
    } else {
        app.getHttpData(false,url, 'GET', '', function(msgData) {
            if (msgData.errno == 0) {
                //判断是否是最后一页
                if (msgData.data.data) {
                    // 更新上一页数据
                    let pages = getCurrentPages()
                    //更新已经打开的页面
                    // pages[1].getMsg(0)
                    pages[1].onLoad()
                    pages[0].onLoad()
                    var list = that.data.content;
                    for (var i = 0; i < msgData.data.data.length; i++) {
                        if (msgData.data.data[i].url) {
                            msgData.data.data[i].url = that.data.oaServer + msgData.data.data[i].url
                        }
                        list.unshift(msgData.data.data[i])
                    }
                    let zb = msgData.data.data.length - 1
                    that.setData({
                        loadingShow: false,
                        oaServer: msgData.data.oa_server,
                        content: list,
                        lastMsgID: msgData.data.data[zb].q_id,
                    })
                    that.setData({
                        toView: 'a' + msgData.data.data[0].q_id
                    })
                } else {
                    that.setData({
                        loadingShow: true,
                        loadingMsg: '已无更多数据',
                        lastPage: true
                    })
                }
            }
        })
    }
}
Page({
    data: {
        host: app.globalData.host,
        content: [],
        scrollHeight: 300,
        btnShow: false,
        imgWidth: 300,
        toView: 'a9',
        btnShowHeight: 300,
        btnShowWidth: 300,
        oaServer: 'http://127.0.0.1/',
        userInfo: {},
        fromUid: '',
        loadingShow: false,
        loadingMsg: '数据加载中...',
        lastMsgID: '',
        msgStr: '', //要发送的内容
        lastPage: false //最后一页数据
    },
    refresh: function(event) {
        var that = this
            //  该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
        that.setData({
            loadingShow: true,
        })
        let url = 'oa/get_old?fromuid=' + that.data.fromUid + '&MSG_ID=' + that.data.lastMsgID
        getList(that, url)
    },
    /**
     * 监听手机号输入
     */
    listenerInput: function(e) {
        // this.data.msgStr = e.detail.value;
        this.setData({
            msgStr: e.detail.value
        })
    },
    send(e) {
        //发送文本消息
        let that = this
        let url = 'oa/send_signle_msg'
        if (that.data.msgStr != '') {
            let data = {
                CONTENT: that.data.msgStr,
                Q_UID: that.data.fromUid
            }
            app.getHttpData(false,url, 'POST', data, function(msgData) {
                if (msgData.data.data) {
                    let newMsg = {
                        q_id: 999999999,
                        to_uid: that.data.fromUid,
                        q_uid: app.globalData.userInfo.UID,
                        send_time: '刚刚',
                        msg_from: '1',
                        content: msgData.data.data[0].content,
                        msg_cate: 'text'
                    }
                    let newMsgData = that.data.content
                    newMsgData.push(newMsg)
                    that.setData({
                        msgStr: '',
                        content: newMsgData
                    })
                    that.setData({
                        toView: 'a999999999'
                    })
                }
            })
        }
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
        let url = 'oa/get_dialog_list?fromuid=' + that.data.fromUid
        getList(that, url)
    },
    tapShow: function(e) {
        this.setData({
            btnShow: true,
        })
    },
    tapHide: function(e) {
        this.setData({
            btnShow: false
        })
    },
    tapIcon(e) {
        let that = this
        wx.chooseImage({
            success: function(res) {
                var tempFilePaths = res.tempFilePaths
                wx.uploadFile({
                    url: app.globalData.host + 'api/oa/upload_file',
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
                        let newMsg = {
                            q_id: 99999999,
                            to_uid: that.data.fromUid,
                            q_uid: app.globalData.userInfo.UID,
                            send_time: '刚刚',
                            msg_from: '1',
                            content: res.data.content,
                            url: tempFilePaths[0],
                            msg_cate: 'image'
                        }
                        let newMsgData = that.data.content
                        newMsgData.push(newMsg)
                            // console.log(that.data.content)
                        that.setData({
                            btnShow: false,
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
