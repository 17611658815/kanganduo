var app = getApp();
Page({
  data: {
    flge:false,
    userId: '',
    bankinfo: wx.getStorageSync('bankinfo') ? wx.getStorageSync('bankinfo'): {
      bank_id:0,
      bank: '',
      code: '',
      identity: '',
      mobile: '',
      name: ''
    },
  
    isHide: 'none',//判断显示隐藏状态
    myinFormaTion: [],
    // bank: '',
    
    bankId:'',
    userMsgList:{},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options.bankShow)
    
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    that.setData({
      userid: userid
    })  
    if (userid == 0) {
      wx.redirectTo({
        url: '../login/login',
      })
    }
      that.getbankmsg();
      // wx.setStorageSync('reload');
     var tiemer =  setInterval(function(){
        if (wx.getStorageSync('reload')){
          wx.setStorageSync('reload', false);
          var bankinfo = wx.getStorageSync('bankinfo');
          console.log(that.data.bankinfo);
          that.setData({
            bankinfo: bankinfo
          })
        }
      },300);   
  },
  // 银行卡信息
  // 姓名
  saveUserName: function (e) {
    var that = this;
    // console.log(e)
    that.data.bankinfo.name = e.detail.value;
    that.setData({
      bankinfo: that.data.bankinfo
    })
    // console.log(that.data.userName)
  },
  // 银行卡号
  saveBankNum: function (e) {
    var that = this;
    that.data.bankinfo.code = e.detail.value;
    that.setData({
      bankinfo: that.data.bankinfo
    })
  },
  // 身份证号
  saveIdNum: function (e) {
    var that = this;
    that.data.bankinfo.identity = e.detail.value;
    that.setData({
      bankinfo: that.data.bankinfo
    })
  },
  // 预留手机号
  saveUserTel: function (e) {
    var that = this;
    that.data.bankinfo.mobile = e.detail.value;
    that.setData({
      bankinfo: that.data.bankinfo
    })
  },
  // 选择一行卡
  chooseBank: function () {
    var that = this;
      that.goChooseAbank() 
  },

  // 选取银行卡路由
  goChooseAbank: function () {
    console.log(11);
    wx.setStorageSync('bankinfo', this.data.bankinfo);
    wx.navigateTo({
      url: '../gochooseAbank/gochooseAbank',
    })
  },
  // 提交银行卡信息
  submit: function () {
    var that = this;
    var userName = that.data.bankinfo.name;
    var bankNum = that.data.bankinfo.code;
    var bank = that.data.bankinfo.bank;
    var IdNum = that.data.bankinfo.identity;
    var userTel = that.data.bankinfo.mobile;
    //身份证号正则
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    //手机号正则
    var myreg = /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/;
    // 非空校验
    if (userName == '') {
      that.alert('姓名不能为空');
      return false;
    } else if (bankNum.length< 16 || bankNum.length> 19) {
      that.alert('银行卡号长度有误');
      return false;
    }
      else if (!reg.test(IdNum)) {
      that.alert('身份证输入不合法');
      return false;
    } else if (userTel.length != 11) {
      that.alert('手机号长度有误');
      return false;
    } else if (!myreg.test(userTel)) {
      that.alert('手机号格式不正确');
      return false;
    } else if (bank=="") {
      that.alert('请选择银行');
      return false;
    } else {
      wx.removeStorageSync('userName')
      wx.removeStorageSync('bankNum')
      var argu='';
      for(var i in that.data.bankinfo){
        argu += '&'+i + '=' + that.data.bankinfo[i];
      }
      wx.request({
        url: app.globalData.ip +'?type=set_bank&uid=' + that.data.userid + argu,
        header: {
          'content-type': 'application/json'
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data);
          if(res.data.res == false){
           
            that.setData({
              isHide: 'block',
              errorMsg:res.data.msg
            });
            setTimeout(function () {
              that.setData({
                isHide: 'none',
              })
            }, 2000);
            wx.navigateTo({
              url: '../center/center',
            })
            
          }else{
            that.setData({
              isHide: 'block',
              errorMsg: res.data.msg,
            });
            setTimeout(function () {
              that.setData({
                isHide: 'none',
              })
            }, 2000);
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },
  getbankmsg(){
    var that = this;
    wx.request({
      url: app.globalData.ip +'?type=get_bank&uid=' + that.data.userid ,
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function (res) {
        console.log(res)
        if (res.data.bank_id!=undefined){
          wx.setStorageSync('bankinfo', res.data);
          wx.setStorageSync('reload', false);
          that.setData({
            bankinfo: res.data,
            flge:true
          });
        }
      },
      fail: function (res) {
        console.log(res.data);
      }
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
  onUnload: function () {
    var that = this;
    that.remover()
  },
  remover(){
    wx.removeStorageSync('bankinfo')
  },
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  onShareAppMessage: function () {
    var that = this;
    return app.share(
      '/pages/index/index',
    );
  },
})