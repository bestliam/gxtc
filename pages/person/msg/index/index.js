//weixun index
var app = getApp()
Page({
    data: {
        /**
         * 页面配置
         */
        winWidth: 0,
        winHeight: 0,
        // tab切换
        currentTab: 0,
        msgItem: [],
        loadShow: false,
        currentPage: 1,
        host:'',
    },
    lower: function() {
        var that = this
        that.setData({
            loadShow: true
        })
        let page = that.data.currentPage + 1
        //重新获取新的数据
        that.getMsg(page)
    },
    onLoad: function() {
        var that = this
        //获取系统信息
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight,
                    host: app.globalData.host
                })
            }
        })
        that.getMsg(1)
    },
    // 获取数据
    getMsg(page){
      let that = this
      let oldData = that.data.msgItem;
      // let url = 'oa/get_msg?currentPage='+page
      let url = 'oa/get_msg'
      app.getHttpData(url, 'POST', '', function(msgData) {
          console.log(msgData)
          if (msgData.data.length > 0) {
            for (var i = 0; i < msgData.data.length; i++) {
                oldData.push(msgData.data[i])
            }
            that.setData({
                msgItem: oldData,
                loadShow: false,
                currentPage: page
            })
          }
      })
    },
    /**
     * 滑动切换tab
     */
    bindChange: function(e) {
        var that = this;
        that.setData({
            currentTab: e.detail.current
        })
    },
    //点击tab切换
    swichNav: function(e) {
        var that = this;
        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })
        }
    }
})
