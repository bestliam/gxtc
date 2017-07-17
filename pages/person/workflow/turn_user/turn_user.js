// turn_user.js
var app = getApp()
Page({
  data:{
    workFlowData: {},
    dataUser:[],
    options:{},
    filtUser:[], //过滤出来的用户 //查库返回的数据
    sponsor:{}, //主办人
    handler:[], //经办人
    selectInfo:['明确指定主办人','先接收','强制转交'],
    inputValue:''
  },
  onLoad:function(options){
    // 请求数据并加载
    let that = this
    let url = 'oa/turn_user'
    app.getHttpData(true, url, 'POST', options, function (workFlowData) {
      console.log(workFlowData)
      let data = workFlowData.data
      that.setData({
        workFlowData:data,
        dataUser:data.userListInfo,
        options:options
      })
    })
  },
  turnSubmit(e){
    //转交工作给下一步骤用户
    let that = this
    let options = that.data.options
    let sponsor = that.data.sponsor
    let handler = that.data.handler
    let url = 'oa/turn_submit'
    options.PRCS_USER_OP = sponsor.byname
    let prcs_user = '' //经办人字符串
    for (var i = 0; i < handler.length; i++) {
      prcs_user += handler[i].byname + ','
    }
    options.PRCS_USER = prcs_user
    app.getHttpData(true, url, 'POST', options, function(workFlowData) {
        let action = workFlowData.data
        if (action == 'WORKHASTURNNEXT') {
          //已經轉交下一步
          wx.showToast({
                  title: '工作转交下一步成功',
                  icon: 'success',
                  duration: 2000,
                  success:function(){
                    let pages = getCurrentPages()
                    pages[0].onLoad()
                    wx.navigateBack({
                      delta: 3
                    })
                  }
              })

        }
    })
  },
  setSponsor(e){
    //重设主办人
    let that = this
    let user = e.currentTarget.dataset.user
    let filtUser = that.data.filtUser
    let handler = that.data.handler
    for (var i = 0; i < filtUser.length; i++) {
      filtUser[i].ZB = false
      if (filtUser[i].byname == user.byname) {
        filtUser[i].ZB = true
      }
    }
    //主办人必须是经办人，如主办人不在经办人列表中则加入
    if(JSON.stringify(handler).indexOf(JSON.stringify(user.byname))==-1){
      handler.push(user)
    }

    that.setData({
      sponsor:user,
      filtUser:filtUser,
      handler:handler
    })
  },
  delSponsor(e){
    //删除主办人
    let that = this
    let byname = e.currentTarget.dataset.byname
    let filtUser = that.data.filtUser
    for (var i = 0; i < filtUser.length; i++) {
      if (filtUser[i].byname == byname) {
        filtUser[i].ZB = false
        break
      }
    }
    that.setData({
      sponsor:{},
      filtUser:filtUser
    })
  },
  bindInput: function(e) {
    //输入用户姓名或工号查询
    let that = this
    let inputName = e.detail.value
    let dataUser = this.data.dataUser
    let sponsor = this.data.sponsor
    //输入用户姓名或工号搜索用户
    if (inputName.length>0) {
      let filtUser = []
      let user_name_index = ''
      for (var i = 0; i < dataUser.length; i++) {
        // 清除user_name_index包含的*
        user_name_index = dataUser[i].user_name_index
        dataUser[i].user_name_index = user_name_index.replace(/[\*]/g, '')
        if (dataUser[i].user_name.indexOf(inputName) >= 0 || dataUser[i].byname.indexOf(inputName) >= 0 || dataUser[i].user_name_index.indexOf(inputName) >= 0) {
          filtUser.push(dataUser[i])
        }
      }

      for (var i = 0; i < filtUser.length; i++) {
        if (filtUser[i].byname == sponsor.byname) {
          filtUser[i].ZB = true
        }else {
          filtUser[i].ZB = false
        }
      }
      that.setData({
        filtUser: filtUser
      })
    }
  },
  selectUser(e){
    let that = this
    let user = e.currentTarget.dataset.user
    let sponsor = that.data.sponsor
    let handler = that.data.handler
    let filtUser = this.data.filtUser
    //设置主办人
    if (!sponsor.byname) {
      sponsor = {byname:user.byname,user_name:user.user_name}
      for (var i = 0; i < filtUser.length; i++) {
        if(filtUser[i].byname == sponsor.byname){
          filtUser[i].ZB = true
        }else {
          filtUser[i].ZB = false
        }
      }
      that.setData({
        sponsor:sponsor,
        filtUser: filtUser
      })
    }
    //添加经办人
    if (handler.length==0) {
      handler.push({byname:user.byname,user_name:user.user_name})
      that.setData({
        handler:handler
      })
    }
    if (handler.length>0) {
      let flag = true  //是否新经办人
      for (var i = 0; i < handler.length; i++) {
        if (handler[i].byname == user.byname) {
          flag = false  //该经办人已经存在
          break
        }
      }
      if (flag) {
        handler.push({byname:user.byname,user_name:user.user_name})
        that.setData({
          handler:handler
        })
      }
    }
  },

})
