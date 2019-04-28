// pages/center/center.js
var app = getApp();
Page({
  data: {
    nickName: '',
    userid: '',
    userInfoAvatar: '',
    position: '',
    userPic: '',
    monay: '',
    is_pay: '',
    active: '',
    Mgtop: '',
    page: 1,
    winWidth: 0,
    winHeight: 0,
    isHide: 'none',
    loading: false,
    show: true,
    scroll: true,
    time: [],
    top: '',
    cooperation: '11',
    isIphoneX: false,
  },
  onLoad: function (option) {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    var phone = wx.getStorageSync('phone')
    var is_pay = that.data.is_pay
    console.log(app)
    if (userid == 0) {
      wx.redirectTo({
        url: '../login/login',
      })
    } else {
      if (is_pay == 0) {
        that.setData({
          show: true,
          userid: userid,
          scroll: false
        });
      } else {
        that.setData({
          show: false,
          userid: userid,
          scroll: true,
        });
      }
      wx.getSystemInfo({
        success: (res) => {
          console.log(res)
          if (res.model.search('iPhone X') != -1) {
            console.log('iPhone X')
            that.setData({
              isIphoneX: true
            })
          }
          that.setData({
            windowHeight: res.windowHeight / res.windowWidth * 750 - 150,
            windowWidth: res.windowWidth
          });
        }
      })
      that.getDocterMsg(phone)
    }
  },
  getDocterMsg(phone) {
    var that = this
    wx.request({
      // url: app.globalData.ip + '?type=doctor_info&phone='+phone ,
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
        that.setData({
          cooperation: res.data.msg.cooperation,
          nickName: res.data.msg.name,
          userInfoAvatar: res.data.msg.avatar,
          cooperation: res.data.msg.cooperation
        })
        console.log(that.data.cooperation)
      }
    })
  },
  // 获取专家信息
  // getInfo: function () {
  //   var that = this;
  //   wx.request({
  //     url: app.globalData.ip +'?type=get_doctor&uid=' + that.data.userid,
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'GET',
  //     success: function (res) {
  //       console.log(res);
  //       that.setData({
  //         nickName: res.data.name,
  //         userInfoAvatar: res.data.avatar,
  //         position: res.data.position,
  //       })
  //     },
  //     fail: function (res) {
  //       console.log(res)
  //     }
  //   })
  // },
  // 下拉退出登录
  PullDownRefresh: function () {
    var that = this;
    app.globalData.user = ''
    wx.removeStorageSync('userinfo')
    wx.showLoading({
      title: '退出中..',
    })
    setTimeout(function () {
      wx.hideLoading()
      // 清理成功toast
      that.setData({
        isHide: 'block',
      });
      setTimeout(function () {
        that.setData({
          isHide: 'none',
        })
        wx.redirectTo({
          url: '../login/login',
        })
      }, 2000);
    }, 2000)
  },
  gomayInformation() {
    wx.navigateTo({
      url: '/pages/mayinformation/mayinformation',
    })
  },
  getMonayList() {
    var that = this;
    wx.request({
      url: app.globalData.ip + '?type=earnings&uid=' + that.data.userid,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        that.setData({
          monay: res.data,
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  goHome: function () {
    wx.redirectTo({
      url: '../index/index',
    })
  },
  goMoney: function () {
    wx.navigateTo({
      url: '../money/money',
    })
  },
  goEdit: function () {
    wx.navigateTo({
      url: '../editInfo/editInfo',
    })
  },
  gofeedback: function () {
    wx.navigateTo({
      url: '../feedback/feedback',
    })
  },
  gotextAsk: function () {
    wx.navigateTo({
      url: '../textAsk/textAsk',
    })
  },
  goanswer: function () {
    wx.navigateTo({
      url: '../answer/answer',
    })
  },
  goAskLIst: function () {
    wx.navigateTo({
      url: '../askList/askList',
    })
  },
  alert(content) {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: false
    })
    return this
  },
  loading: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
      duration: 10000
    })
  },
  //去传三证
  goCertification() {
    wx.navigateTo({
      url: '../certification/certification',
    })
  },
  //分享页面 
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/index/index',
    );
  },
})