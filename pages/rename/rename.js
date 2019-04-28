// pages/rename/rename.js
var app = getApp()
Page({
  data: {
    oldName: '',
    newName: '',
    optionePath: '',
  },
  newName: function(e){
    var that = this;
    that.setData({
      newName: e.detail.value
    });
    console.log(that.data.newName);
  },
  onLoad: function (option) {
    var that = this;
    var optionePath = decodeURIComponent(option.optionePath);
    console.log(optionePath);
    var audioList = wx.getStorageSync('audioList');
    console.log(audioList);
    audioList[optionePath]
    console.log(audioList[optionePath]);
    that.setData({
      oldName: audioList[optionePath].title,      
      optionePath: optionePath
    })
  },
  saveNew: function(){
    var that = this;
    var optionePath = that.data.optionePath;
    var audioList = wx.getStorageSync('audioList');
    audioList[optionePath].title = that.data.newName;
    console.log(audioList[optionePath].title);
    wx.setStorageSync('audioList', audioList);
    app.globalData.refresh = true;
    console.log(audioList[optionePath],that.data.newName);
    wx.navigateBack({
      delta: 1
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