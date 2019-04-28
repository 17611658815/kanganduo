var app = getApp();
Page({

  data: {
    title:'',
    question:'',
    errmsg:''
  },
  onLoad: function (options) {
    var that = this;
    var title = options.title;
    var question = options.question;
    console.log(options.errmsg)
    that.setData({
      question: question,
      title: title,
      errmsg: app.globalData.errmsg
    });
  },
  
  goRecord: function (e) {
    var that = this;
    // var question = e.currentTarget.dataset.question;
    // var title = e.currentTarget.dataset.title;
    // console.log(e.currentTarget.dataset.questionId);
    wx.navigateTo({
      url: '../record/record?questionId=' + that.data.question + '&title=' + that.data.title,
    })
  },

})