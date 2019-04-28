var app = getApp();
// console.log(app)
// pages/myBank/myBank.js
Page({
  data: {
    yeer:'',
    date:'',
    userid: '',
    nickName:'',
    userInfoAvatar:'',
    position:'',
    Show:false,
    time:[],
    monay:"",//回答收益
    count:"" , //回答数量
    monayList:[]
  },
  //  点击日期组件确定事件  
  bindDateChange: function (e) {
    console.log(e.detail.value)
    var that = this
    var time = that.data.time;
    this.setData({
      time: e.detail.value.split("-")
    })
    this.getMonayList();
  },
  // 提现
  deposit(){
    var that = this
    var phone = wx.getStorageSync('phone') || undefined;
     wx.request({
       url: app.globalData.ip + '?type=doctor_info&phone=' + phone,
       header: {
         'content-type': 'application/json'
       },
       method: 'GET',
       success: (res) => {
         console.log(res)
         if (res.data.res == false){
               wx.navigateTo({
                 url: '../../pages/doctorinformation/doctorinformation?phone=' + phone,
               })
         } else if (res.data.msg.check == 2){
                wx.navigateTo({
                  url: '../../pages/doctorinformation/doctorinformation?phone=' + phone,
                })
         } else if (res.data.msg.check == 1) {
           wx.navigateTo({
             url: '../../pages/doctorinformation/doctorinformation?phone=' + phone,
           })
         }  
         else {
           that.alert('民福康会在每月15日至月末最后一天，支付会员上个自然月产生的收入。')
         }
       }
     })
  },
  alert: function (content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
    return this
  },
  // 获取收益详情
  getMonayList(){
    var that = this;
    wx.request({
      url: app.globalData.ip +'?type=earnings&uid=' + that.data.userid + '&time=' + that.data.time[0] + '-' + that.data.time[1],
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        wx.setStorage({
          key: 'monay',
          data: res.data.total
        }),
        that.setData({
          monay: res.data.total,
          count: res.data.count,
          monayList:res.data.list
          
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  formatNumber:function (n) {
      n = n.toString()
      return n[1] ? n : '0' + n
  },
  goindex:function(){
    wx.navigateTo({
      url: '../index/index',
    })
  },
  // 获取专家信息
  getInfo: function () {
    var that = this;
    wx.request({
      url: app.globalData.ip +'?type=get_doctor&uid=' + that.data.userid,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data);
        that.setData({
          nickName: res.data.name,
          userInfoAvatar: res.data.avatar,
          position: res.data.position,

        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  // 进入页面直接调用
  onLoad: function (options) {
    // 获取用户ID
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    if (userid == 0) {
      wx.redirectTo({
        url: '../login/login',
      })
    }
    console.log(userid);
    that.setData({
      userid: userid
    })
    // 获取本地时间
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    console.log("当前时间戳为：" + timestamp);
    //获取当前时间  
    var n = timestamp * 1000;
    var date = new Date(n);
    //年  
    var Y = date.getFullYear();
    //月  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var time = yeer + date
    var yeer = Y 
    var date = M
    console.log(time)
    this.setData({
      time: [yeer, date]
    })
    that.getInfo()
    that.getMonayList()
  },

  
 
})