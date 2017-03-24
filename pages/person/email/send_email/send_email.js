//获取应用实例
var app = getApp()

Page({
    data: {
      action:'Re',  //新建|回复|转发
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
    //发送邮件
    sendEmail(e){
      // let that = this
      // let toUser = that.data.toUser

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
        let actStr=''
        if (action == 'reply') {
          let EMAIL_DATA=JSON.parse(option.EMAIL_DATA)
            //如果是回复
            let toUser=[{
                dept_name: EMAIL_DATA.dept_name,
                user_id: EMAIL_DATA.from_id,
                user_name: EMAIL_DATA.from_name,
                priv_name: EMAIL_DATA.priv_name,
                user_uid: EMAIL_DATA.uid
            }]
            actStr = 'Re:'
            that.setData({
                emailData: EMAIL_DATA,
                toUser: toUser,
                action:actStr
            })
        }else if (action == 'forward') {
          actStr = 'Fw:'
          let url = 'oa/read_email?EMAIL_ID=' + option.EMAIL_ID
          app.getHttpData(true, url, 'GET', '', function(emailData) {
            that.setData({
                emailData: emailData.data,
                action:actStr
            })
          })
        }
    },
    cancleDown(e) {
        this.setData({
            btnShow: false
        })
    },
    tapClick(e) {
        this.setData({
            btnShow: true,
            url: e.currentTarget.dataset.url
        })
    }
})