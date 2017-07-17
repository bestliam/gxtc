let app = getApp()
Page({
  data: {
    host: app.globalData.host,
    winHeight: 100,
    workFlowData: {},
    options: {},
    prcsIdNext:''  //下一步骤编号
  },
  onShow() {
      let that = this
      wx.getSystemInfo({
          success: function(res) {
              that.setData({
                  winHeight: res.windowHeight
              })
          }
      })
  },
  onLoad(options) {
    // 加载数据
    let that = this
    let url = 'oa/turn_work_flow'
    app.getHttpData(true, url, 'POST', options, function (workFlowData) {
      console.log(workFlowData) //保存表单成功后进入转交下一步
      that.setData({
          workFlowData: workFlowData.data,
          options: options
      })
    })
  },
  formSubmit: function(e) {
    let prcs_id_next = e.detail.value.checkbox
    let that = this
    let options = that.data.options
    wx.navigateTo({
      url: '../turn_user/turn_user?RUN_ID='+options.RUN_ID+'&FLOW_ID='+options.FLOW_ID+'&PRCS_ID='+options.PRCS_ID+'&FLOW_PRCS='+options.FLOW_PRCS+'&PRCS_KEY_ID='+options.PRCS_KEY_ID+'&PRCS_ID_NEXT='+prcs_id_next
    })
  }
})
