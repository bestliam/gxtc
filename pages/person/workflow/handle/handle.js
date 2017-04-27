let app = getApp()
Page({
    data: {
        host: app.globalData.host,
        winHeight: 100,
        workFlowData: {},
        options: {},
        model: {}
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
        //加载数据
        let that = this
        let url = 'oa/get_one_work_flow_data'
        app.getHttpData(true, url, 'POST', options, function(workFlowData) {
            console.log(workFlowData)
            that.setData({
                workFlowData: workFlowData.data,
                model: workFlowData.data.form_fields,
                options: options
            })
        })
    },
    formSubmit: function(e) {
        //整理数据
        let that = this
        let edata = e.detail.value
        let options = that.data.options
        let formData = that.data.workFlowData.form_fields
        let subFormData = []
        for (var i = 0; i < formData.length; i++) {
            if (!formData[i].writable) {
                subFormData.push({
                    name: formData[i].id,
                    value: formData[i].content || formData[i].value
                })
            }
        }
        // 使用Array.forEach输出属性名和属性值
        Object.getOwnPropertyNames(edata).forEach(function(val, idx, array) {
            subFormData.push({
                name: val,
                value: edata[val]
            })
        })
        let data = {data:JSON.stringify(subFormData),RUN_ID:options.RUN_ID,FLOW_ID:options.FLOW_ID,PRCS_ID:options.PRCS_ID,FLOW_PRCS:options.FLOW_PRCS}
        let url = 'oa/save_one_work_flow_data'
        app.getHttpData(true, url, 'POST', data, function(workFlowData) {
            console.log(workFlowData)
        })
    },
    //点击附件方法
    tapClick(e) {
        let that = this
        let fileType = e.currentTarget.dataset.type //获取文件类型
        let imgArr = ['png', 'jpg', 'gif']
        let imgFlag = imgArr.indexOf(fileType)
        let offArr = ['doc', 'xls', 'ppt', 'pdf', 'docx', 'xlsx', 'pptx']
        let offFlag = offArr.indexOf(fileType)
        let url = 'oa/attach_show?' + e.currentTarget.dataset.url
        app.getHttpData(true, url, 'GET', '', function(attachData) {
            let openUrl = app.globalData.host + 'static/oa_attach/' + attachData.data
            if (offFlag != -1) {
                wx.downloadFile({
                    url: openUrl,
                    success: function(res) {
                        let filePath = res.tempFilePath
                        wx.openDocument({
                            filePath: filePath
                        })
                    }
                })
            } else if (imgFlag != -1) {
                wx.previewImage({
                    current: openUrl, // 当前显示图片的http链接
                    urls: [openUrl] // 需要预览的图片http链接列表
                })
            } else {
                wx.showModal({
                    title: '提示',
                    content: '目前不支持在线浏览这种类型文件',

                })
            }
        })
    }

})
