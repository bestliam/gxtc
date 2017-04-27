let app = getApp()
Page({
    data: {
      winHeight:100,
      workFlowList:[]
    },
    onShow(){
      //加载数据
      let that = this
      let url = 'oa/get_to_do_list'
      app.getHttpData(true, url, 'GET', '', function(workFlowData) {
          if (workFlowData.data.length > 0) {
              that.setData({
                  workFlowList: workFlowData.data
              })
          }
      })
    },
    onLoad() {
      let that = this
        wx.getSystemInfo({
            success: function(res) {
                that.setData({winHeight:res.windowHeight})
            }
        })
    }
})
