//获取应用实例
var app = getApp()

Page({
    data: {
        action: 'Re', //新建|回复|转发
        toUser: [], //收件人
        searchUser: [], //查找人
        currentTab: 0, //当前标签
        emailData: {}, //邮件内容
        scrollHeight: 300,
        host: app.globalData.host,
        btnShow: false,
        url: '',
        searchWord: '',
        emailID: 0,
        upload: []
    },
    //选择图片
    chooseImg(e) {
        let that = this
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let tempFilePaths = res.tempFilePaths[0]
                let strArr = tempFilePaths.split(".")
                let name = strArr[0].split("-")[1] //截取姓名
                let icon = strArr[1] //截取后缀
                let newPic = {
                    name: name + '.' + icon,
                    url: tempFilePaths,
                    icon: icon
                }
                let upload = that.data.upload
                upload.push(newPic)
                that.setData({
                    upload: upload
                })
            }
        })
    },
    sendImg(currentUploadImgIndex, cb) {
        let that = this
        let upload = this.data.upload
        let _currentUploadImgIndex = currentUploadImgIndex
        wx.uploadFile({
            url: app.globalData.host + 'api/oa/email_upload',
            header: {
                'access_token': app.globalData.userInfo.ACCESS_TOKEN
            },
            filePath: upload[_currentUploadImgIndex].url,
            name: 'ATTACHMENT',
            formData: {
                name: upload[_currentUploadImgIndex].name,
            },
            success: function(res) {
                _currentUploadImgIndex += 1
                if (_currentUploadImgIndex < upload.length) {
                    that.sendImg(_currentUploadImgIndex, cb)  //递归发送图片
                } else {
                    //所有图片上传完后回调
                    cb(res.data)
                }
            }
        })
    },
    //发送邮件
    sendEmail(e) {
        let that = this
        let upload = that.data.upload
        let emailID = that.data.emailID
        let toUser = that.data.toUser
        let emailContent = e.detail.value
            //toUser 不为空时才执行
        if (toUser.length > 0) {
            //如果存在附件，上传附件到服务器
            if (upload.length > 0) {
                that.sendImg(0, function(res) {
                    if (JSON.parse(res).errno == 0) { //图片上传成功
                        //拼接发送用户串
                        let toUserStr = ''
                        for (var i = 0; i < toUser.length; i++) {
                            toUserStr += toUser[i].user_uid + ','
                        }
                        toUserStr = toUserStr.substr(0, toUserStr.length - 1); //去除最后的逗号
                        let url = 'oa/send_email'
                        let data = {
                                to_id: toUserStr,
                                subject: emailContent.subject,
                                content: emailContent.content,
                                EMAIL_ID: emailID,
                                ATYPE:that.data.action
                            }
                            //如果存在上传附件，则加入附件前缀
                        if (upload.length > 0) {
                            data.upload = upload
                        }
                        app.getHttpData(false, url, 'POST', data, function(reData) {
                            if (reData.errno == 0) {
                                wx.showToast({
                                        title: '邮件发送成功',
                                        icon: 'success',
                                        duration: 1500
                                    })
                                    wx.navigateBack({
                                        delta: 2
                                    })
                            }
                        })
                    }
                })
            }

        }
    },
    listenerInput(e) {
        this.setData({
            searchWord: e.detail.value
        })
    },
    //选择或取消选择用户
    selectUser(e) {
        let that = this
        let toUser = that.data.toUser
        let num = toUser.length
        let searchUser = that.data.searchUser
        let newUser = e.currentTarget.dataset.user
            //修改选择的用户列表
        for (var i = 0; i < searchUser.length; i++) {
            if (searchUser[i].user_uid == newUser.user_uid) {
                (newUser.iconColor == '#50587d') ? searchUser[i].iconColor = '': searchUser[i].iconColor = '#50587d'
            }
        }
        //遍历toUser,如存在则删除，如不存在则增加
        for (var j = 0; j < toUser.length; j++) {
            if (toUser[j].user_uid == newUser.user_uid) {
                toUser.splice(j, 1)
            }
        }

        (newUser.iconColor == '#50587d') ? newUser.iconColor = '': newUser.iconColor = '#50587d'
        if (toUser.length == num) {
            toUser.push(newUser)
        }
        that.setData({
            toUser: toUser,
            searchUser: searchUser
        })
    },
    //查找用户
    searchUser(e) {
        let that = this
        let url = 'oa/search_user?KWORD=' + this.data.searchWord
        app.getHttpData(true, url, 'GET', '', function(userData) {
            let array = userData.data
            let toUser = that.data.toUser
            for (var i = 0; i < array.length; i++) {
                if (toUser.length == 0) {
                    array[i].iconColor = '#50587d'
                } else {
                    for (var j = 0; j < toUser.length; j++) {
                        if (array[i].user_id != toUser[j].user_id) {
                            array[i].iconColor = '#50587d'
                        }
                    }
                }
            }
            that.setData({
                searchUser: array,
            })
        })
    },
    //切换标签
    bindChange: function(e) {
        var that = this
        that.setData({
            currentTab: e.detail.current
        })
    },
    swichNav: function(e) {
        var that = this
        if (this.data.currentTab === e.target.dataset.current) {
            return false
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    },
    delUser(e) {
        let toUser = this.data.toUser
        let newList = toUser.filter(function(obj) {
            return e.currentTarget.dataset.id != obj.user_uid
        })
        this.setData({
            toUser: newList
        })
    },
    addUser() {
        this.setData({
            btnShow: true,
            searchWord: '',
            searchUser: []
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
                    scrollHeight: res.windowHeight - 180,
                })
            }
        })
    },
    onLoad(option) {
        let that = this
        let action = option.ACTION
        let actStr = ''
        if (action == 'reply') {
            let EMAIL_DATA = JSON.parse(option.EMAIL_DATA)
                //如果是回复
            let toUser = [{
                dept_name: EMAIL_DATA.dept_name,
                user_id: EMAIL_DATA.from_id,
                user_name: EMAIL_DATA.from_name,
                priv_name: EMAIL_DATA.priv_name,
                user_uid: EMAIL_DATA.uid
            }]
            actStr = 'Re'
            that.setData({
                emailData: EMAIL_DATA,
                toUser: toUser,
                action: actStr,
                emailID: option.EMAIL_ID
            })
        } else if (action == 'forward') {
            actStr = 'Fw'
            let url = 'oa/read_email?EMAIL_ID=' + option.EMAIL_ID
            app.getHttpData(true, url, 'GET', '', function(emailData) {
                that.setData({
                    emailData: emailData.data,
                    action: actStr,
                    emailID: option.EMAIL_ID
                })
            })
        }
    },
    cancleDown(e) {
        this.setData({
            btnShow: false
        })
    }
})
