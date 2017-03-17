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
        currentPage: 0,
        host:app.globalData.host,
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
                })
            }
        })
        that.getMsg(that.currentTab)
    },
    // 获取数据
    getMsg(currentTab){
      let that = this
      let url =''
      if (currentTab == 1) {
        url = 'oa/group_list'
      }else {
        url = 'oa/im_recent'
      }
      app.getHttpData(true,url, 'GET', '', function(msgData) {
          if (msgData.data.length > 0) {
              for (var i = 0; i < msgData.data.length; i++) {
                if (msgData.data[i].content && msgData.data[i].content.substring(0,4)=='[im]') {
                  msgData.data[i].content = '[图片]'
                }
              }
            that.setData({
                msgItem: msgData.data,
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
        that.getMsg(e.detail.current)
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
