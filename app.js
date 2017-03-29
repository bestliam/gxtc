//app.js
App({
    onLaunch: function() {
        //调用API从本地缓存中获取数据
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)
    },

    /**
     * 调用远端服务器api接口方法
     * url 远端api的地址
     * method 调用方式 GET/POST/PUT 大写
     * data 发送给api的数据
     * cb callback函数，返回数据
     * 调用方式  getHttpDa
     * */
    getHttpData: function(note, url, method, data, cb) {
        let headerData = {
            'content-type': 'application/json'
        }
        if (this.globalData.userInfo.ACCESS_TOKEN) {
            headerData = {
                'access_token': this.globalData.userInfo.ACCESS_TOKEN
            }
        }
        let fullUrl = this.globalData.host + 'api/' + url
        let noteIs = note || false
        var that = this
        if (noteIs) {
            wx.showToast({
                title: '数据加载中',
                icon: 'loading',
                duration: 10000
            })
        }
        wx.request({
            url: fullUrl,
            data: data,
            header: headerData,
            method: method,
            success: function(res) {
                if (res.data.errno == 10002) {
                    //删除缓存并重新获取userInfo
                    wx.removeStorageSync('userInfo')
                    // wx.redirectTo({
                    //         url: '/pages/animation/animation'
                    //     })
                    that.getUserInfo(function(cb) {
                        wx.redirectTo({
                            url: '/pages/index/index'
                        })
                    })
                } else {
                    cb(res.data);
                }
            },
            fail: function() {
                console.log("远程数据连接不上")
            },
            complete: function() {
                wx.hideToast()
            }
        })
    },

    getUserInfo: function(cb) {
        var that = this
        if (this.globalData.userInfo) {
            typeof cb == "function" && cb(this.globalData.userInfo)
        } else {
            //调用登录接口
            wx.login({
                fail: function(data) {
                    console.log("微信登陆失败：", data)
                },
                success: function(data) {
                    wx.getUserInfo({
                        success: function(res) {
                            that.globalData.userInfo = res.userInfo
                            let url = that.globalData.host + 'api/wx/get_access_token'
                            let postData = {
                                    code: data.code,
                                    tntid: that.globalData.tntid
                                }

                            let headerData = {
                                    'content-type': 'application/json'
                                }
                            wx.request({
                                url: url,
                                data: postData,
                                header: headerData,
                                method: 'POST',
                                success: function(resData) {
                                    if (resData.data.data.GH) {
                                        that.globalData.userInfo.GH = resData.data.data.GH
                                        that.globalData.userInfo.UID = resData.data.data.UID
                                        that.globalData.userInfo.XM = resData.data.data.XM
                                        that.globalData.userInfo.ROLE = resData.data.data.ROLE
                                        that.globalData.userInfo.ACCESS_TOKEN = resData.data.data.access_token
                                        that.globalData.userInfo.EXPIRE = Date.now()
                                    }
                                    //写入缓存
                                    wx.setStorageSync('userInfo', that.globalData.userInfo)
                                    typeof cb == "function" && cb(that.globalData.userInfo)
                                },
                                fail: function() {
                                    cb({
                                        errno: 10007,
                                        errmsg: '远程服务器不可用'
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    },
    globalData: {
        userInfo: null,
        host: 'http://api.gxtc.com:8360/', //测试地址
        // host: 'https://api.gxtc.edu.cn/',   //线上地址
        tntid: 'tntc409e8fede7211b2'
    }
})
