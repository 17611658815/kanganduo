// pages/mayinformation/mayinformation.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      doctor:{
        name:'',
        identity_code:'',
        hospital:'',
        department:'',
        doctor_rank:'',
        mobile:'',
        describe:'',
        introduction:''
      },
    array: ['主任', '副主任', '主治', '医师', '教授', '高级营养师', '中级营养师', '初级营养师', '康复师'], //客服
    index:'',
    msg:{},
    code:'',
    userInfoAvatar:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onShow:function(){
    var that = this
    var userinfo = wx.getStorageSync('userinfo') || {};
    var phone = wx.getStorageSync('phone')

    that.getDocterMsg(phone)
    that.getCode(phone) 
  },
  onLoad: function (options) {
    var that = this
    var userinfo = wx.getStorageSync('userinfo') || {};
    var phone = wx.getStorageSync('phone')
    that.getDocterMsg(phone)
    that.getCode(phone) 
  },
  //判断登录状态
  getCode(phone) {
    var that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/kangaiduo/checkExpertData/',
      data: {
        appid: app.globalData.appid,
        mobile: phone
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (res) => {
        console.log(res.data.code)
        that.setData({ code: res.data.code })
      }
    })
  },
  getDocterMsg(phone) {
    var that = this
    wx.request({
      url: 'https://mfkapi.39yst.com/appInterface/kangaiduo/getExpertInfo/',
      data: {
        appid: app.globalData.appid,
        phone: phone
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: (res) => {
        console.log(res)
        that.data.doctor.name = res.data.msg.name;
        that.data.doctor.hospital = res.data.msg.hospital;
        that.data.doctor.department = res.data.msg.department;
        that.data.doctor.mobile = res.data.msg.mobile;
        that.data.doctor.identity_code = res.data.msg.identity_code;
        that.data.doctor.describe = res.data.msg.describe;
        that.data.doctor.introduction = res.data.msg.introduction;
        that.data.doctor.doctor_rank = res.data.msg.doctor_rank,
        that.data.userInfoAvatar = res.data.msg.avatar
        that.setData({
          doctor: that.data.doctor,
          msg:res.data.msg,
          index: that.data.index,
          userInfoAvatar: that.data.userInfoAvatar
        })
        
      }
    })
  },
  goaddadept(){
    var that = this
    wx.navigateTo({
      url: '/pages/addadept/addadept',
    })
  },
  //去看三证
  gonextStep() {
    var that = this
    if (that.data.code == 201) {
      wx.navigateTo({
        url: '../certification/certification',
      })
    } else if (that.data.code == 203) {
      wx.navigateTo({
        url: '../Uploadagain/Uploadagain',
      })
    } else {
      wx.navigateTo({
        url: '/pages/identification/identification',
      })
    }
  },
  //去编辑个人简介
  goindividualresume(){
    wx.navigateTo({
      url: '/pages/individualresume/individualresume',
    })
  },
  //去擅长描述
  goadeptdescription(){
    wx.navigateTo({
      url: '/pages/adeptdescription/adeptdescription',
    })
  }
})