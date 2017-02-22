//获取应用实例
// var util = require('../../../utils/util.js')
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
        currentPage:1,
    },
    lower:function () {
      var that = this
      that.setData({
        loadShow:true
      })
      let page=that.data.currentPage + 1
      //重新获取新的数据
      let url = app.globalData.hostName +'oa/get_msg?currentPage='+ page //'http://127.0.0.1:8360/api/oa/get_msg?currentPage=2&numsPerPage=6'
      let oldData = that.data.msgItem;
      app.getHttpData(url,'GET','','',function(msgData) {
        for (var i = 0; i < msgData.data.length; i++) {
          oldData.push(msgData.data[i])
        }
        that.setData({
          msgItem:oldData,
          loadShow:false,
          currentPage:page
        })
      })
    },
    // user_msg: function (e) {
    //   // console.log(e);
    // },
    onLoad: function() {
        var that = this
        /**
         * 获取系统信息
         */
        wx.getSystemInfo({
            success: function(res) {
                that.setData({
                    winWidth: res.windowWidth,
                    winHeight: res.windowHeight
                })
            }
        })
        let url = 'http://127.0.0.1:8360/api/oa/get_msg?currentPage=1'
        app.getHttpData(url,'GET','','',function(msgData) {
          if (msgData.errno == 0) {
            that.setData({
              msgItem:msgData.data
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
    /**
     * 点击tab切换
     */
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
