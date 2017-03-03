var app = getApp()
Page({
    data: {
        host:app.globalData.host,
        content: [],
        uid: 9,
        // sex: 1,
        // userInfo: {},
        scrollHeight: 300,
        btnShow: false,
        imgWidth: 300,
        toView: 'aa',
        btnShowHeight: 300,
        btnShowWidth: 300,
        scrollTop: 0
    },
    onLoad: function(options) {
      wx.setNavigationBarTitle({
          title: options.fromname
      })
        var that = this
            // let url = 'http://127.0.0.1:8360/api/oa/get_msg_by_fromuid?fromuid=7'
        let url = 'oa/get_msg_by_fromuid?fromuid=' + options.fromuid
        app.getHttpData(url, 'GET', '', '', function(msgData) {
            console.log(msgData)
            if (msgData.errno == 0) {
                wx.getSystemInfo({
                    success: function(res) {
                        that.setData({
                            scrollHeight: res.windowHeight - 50,
                            imgWidth: res.windowWidth - 150,
                            btnShowHeight: res.windowHeight,
                            btnShowWidth: res.windowWidth,
                            sex: options.sex,
                            content: msgData.data.reverse(),
                        })
                    }
                })
                if (that.data.scrollTop == 0) {
                    that.setData({
                        scrollTop: 2000
                    })
                }
            }
        })

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
                    // url: 'http://127.0.0.1/ispirit/im/upload2.php', //仅为示例，非真实的接口地址
                    url: 'http://127.0.0.1:8360/api/oa/upload_file', //仅为示例，非真实的接口地址
                    filePath: tempFilePaths[0],
                    name: 'ATTACHMENT',
                    formData: {
                        UPLOAD_MODE: '1',
                        DEST_UID: '7',
                        MSG_CATE: 'image',
                        P_VER: '7', //对应MSG_TYPE 7定义为微信小程序发送来
                        TYPE: 'mobile'
                    },
                    success: function(res) {
                        let newMsg = {
                            MSG_ID: '5555555555',
                            FROM_UID: '9',
                            TO_UID: '7',
                            REMIND_FLAG: '1',
                            DELETE_FLAG: '0',
                            SEND_TIME: '刚刚',
                            MSG_TYPE: 6,
                            CONTENT: tempFilePaths[0],
                            CONTENT_TYPE: 'image',
                        }
                        let newMsgData = that.data.content
                        newMsgData.push(newMsg)
                        console.log(that.data.content)
                        that.setData({
                            btnShow: false,
                            toView: 'bottom',
                            content: newMsgData
                        })
                        var data = res.data
                            //do something
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
