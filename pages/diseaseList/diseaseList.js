// pages/diseaseList/diseaseList.js
var app = getApp();
Page({
  data: {
    loading:false,
    page: 1,//当前页
    windowHeight: "",//屏幕高
    hasnext: 1,
    diseaseList:[],//问题列表
    keyWords:'',//关键词
    hasWords:true,//搜索
    illnessId: '',//疾病id
    userid: '',
    listNum: 0,//问题长度
    titleArray:[],//标题数组
  },
  //上拉加载更多
  pullUpLoad: function () {
    var that = this;
    console.log(that.data.hasnext);
    if (that.data.hasnext > 0 && !that.data.loading) {
      that.data.loading = true;
      that.data.page++;
      that.loading();
      that.loadList(that.data.keyWords);
      if (that.data.illnessId != '' && that.data.keyWords == ''){
        var url = app.globalData.ip +'?type=question&illness=' + that.data.illnessId + '&page=' + that.data.page + '&uid=' + that.data.userid;
        that.loadList(url);
      } else if (that.data.keyWords != '' && that.data.illnessId == ''){
        var url = app.globalData.ip +'?type=question&q=' + that.data.keyWords + '&page=' + that.data.page + '&uid=' + that.data.userid;
        that.loadList(url);
      };
    }
  },
  onShow: function (e) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        });
      }
    })
  },
  //输入的关键词
  // keyWords:function(e){
  //   var that = this;
  //   that.setData({
  //     keyWords: e.detail.value
  //   })
  // },
  //加载列表
  loadList: function (url) {
    var that = this;
    that.loading();
    var repeat = false;
    console.log(that.data.diseaseList);
    // console.log(that.data.page)
    var diseaseList = that.data.page == 1 ? [] : that.data.diseaseList;
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var list = res.data,
          titlearr = that.data.titleArray;
        console.log(list);
        if (list.length <= 0) {
          that.data.hasnext = 0;
        } else {
          for (var i = 0; i < list.length; i++) {
            if (titlearr.indexOf(list[i].title)<0){//判断标题数组是否存在此标题 indexof<0 表示没有
              diseaseList.push(list[i]);
              titlearr.push(list[i].title);
            }
          };
          that.setData({
            diseaseList: diseaseList,
            listNum: res.data.length,
          });
        }
        that.data.loading = false;
      },
      complete: function () {// complete
        wx.hideToast();
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
  loading: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
  },
  onLoad: function (option) {
    var that = this;
    var userinfo = wx.getStorageSync('userinfo') || {};
    var userid = (userinfo != undefined) ? userinfo.id : 0;
    if (userid == 0) {
      wx.redirectTo({
        url: '../login/login',
      })
    }
    else{
      that.setData({
        userid: userid
      })
    };
    if (option != '' && option.diseaseId != '' && option.keywords == ''){
      console.log(option.diseaseId);
      that.setData({
        illnessId: option.diseaseId,
      });
      var url = app.globalData.ip +'?type=question&illness=' + that.data.illnessId + '&page=' + that.data.page + '&uid=' + that.data.userid;
      that.loadList(url);
    }
    if (option != '' && option.keywords != ''){
      that.setData({
        keyWords: option.keywords,
        userid: userid
      });
      var url = app.globalData.ip +'?type=question&q=' + that.data.keyWords + '&page=' + that.data.page + '&uid=' + that.data.userid;
      that.loadList(url);
    }
  },
  // 搜索
  search: function(){
    var that = this;
    var keyWords = that.data.keyWords;
    that.setData({
      hasnext: 1,
      page: 1,
    })
    that.loadList(keyWords);
  },
  gotoRecord: function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../record/record?questionId=' + id + '&title=' + title,
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