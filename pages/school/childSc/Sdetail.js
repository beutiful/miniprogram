// pages/school/childSc/Sdetail.js
const util = require('../../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
      maskFlag:true, /*设置遮罩 */
      objData:{},
      content:"",
      show:false,
      inputshow:false,
      comments:[],
      open:[],   /*评论回复展开 */
      childCommentReply:false,
      responseLength:0,
      isShowResponse:true, //显示回复信息
      isShowHeart:false,    //显示点赞信息
      heartData:[], //点赞数据
      heartImg:[]  //点赞数据中的用户头像
  },
  /*点赞图片切换 */
  changeimg:function(e){
    var action = '';
    var showImg = this.data.show;
    console.log(this.data.show);
    if(this.data.show == false || this.data.show == null){
      showImg = true;
      action = 'success';
      wx.showToast({
        title: "点赞成功",
        icon: "none",
        duration: 1500,
        mask: true
      });
    }else{
      showImg = false;
      action = 'cancel';
      wx.showToast({
        title: "取消点赞",
        icon: "none",
        duration: 1500,
        mask: true
      });
    }
    this.setData({
      show: showImg
    },heart =>{
      wx.request({
        url: 'https://www.younghao.top/heart/heart',
        method:'POST',
        data:{
          "action":action,
          "school_type":0,
          "school_id":this.data.objData.school_news_id,
        },
        header: {"auth":wx.getStorageSync("login_key")},
        success: (res) => {
          console.log('success');
        }
      })
    })
  },
  /*加遮罩 */
  addChildReplyComment: function(e){
    var commentId = e.currentTarget.dataset.commentid;
    var mainId = e.currentTarget.dataset.mainid;
    var isShowComments = this.data.isShowChildComments;
    console.log(isShowComments);
    isShowComments[mainId][commentId] = true;
    this.setData({
      maskFlag: false,
      isShowChildComments: isShowComments
    })
  },
  /**取消遮罩 */
  noChildReplyComment: function (e) {
    var commentId = e.currentTarget.dataset.commentid;
    var mainId = e.currentTarget.dataset.mainid;
    var isShowComments = this.data.isShowChildComments;
    console.log(isShowComments);
    isShowComments[mainId][commentId] = false;
    console.log(commentId);
    this.setData({
      maskFlag: true,
      isShowChildComments: isShowComments
    })
  },
  /*加遮罩 */
  addChildComment: function (e) {
    var commentId = e.currentTarget.dataset.commentid;
    var isShowComments = this.data.isShowComments;
    console.log(commentId);
    isShowComments[commentId] = true;
    this.setData({
      maskFlag: false,
      isShowComments: isShowComments
    })
  },
  /**取消遮罩 */
  noChildComment: function (e) {
    var commentId = e.currentTarget.dataset.commentid;
    var isShowComments = this.data.isShowComments;
    isShowComments[commentId] = false;
    console.log(commentId);
    this.setData({
      maskFlag: true,
      isShowComments: isShowComments
    })
  },
  /*加遮罩 */
  add:function(e){
    this.setData({
      maskFlag:false,
      inputshow:true
    })
  },
  /**取消遮罩 */
  no:function(e){
    this.setData({
      maskFlag:true,
      inputshow:false
    })
  },
  /*放大查看图片 */
  previewImg: function(e){
    var index = e.currentTarget.dataset.index;
    // 设置预览图片路径
    wx.previewImage({
      current: this.data.objData.school_news_path[index],
      urls: this.data.objData.school_news_path  
     })
  },
  /*处理文章中的空格 */
  lineFeed:function(){
  //  console.log(this.data.objData)
    var content = (this.data.objData.school_news_content).replace(/\/n/g,"\n");
    this.setData({
      content:content
    })
  },
  /**修改浏览人数 */
  countPeople:function(){
    wx.request({
      url:'https://www.younghao.top/people/people',
      method: 'POST',
      data:{
        "table":"school_news",
        "school_news_id":this.data.objData.school_news_id,
        "school_news_count":this.data.objData.school_news_count
      },
      header: {"auth":wx.getStorageSync("login_key")},
      success: (res) => {
        if (res.data.status=='200'){
        //  console.log("success");
          this.onLoad();
        }else{
          console.log("fail");
        }
      }
    })
  },
  /**编辑评论 */
  formSubmit:function(e){
  //  console.log(e);
  //  console.log(this.data.objData);
    var that = this;
    var content = e.detail.value.content;
    if(content == ''){
      wx.showToast({
        title: "评论不能为空",
        icon: "none",
        duration: 1500,
        mask: true
      });
      return;
    }
    wx.request({
      url: 'https://www.younghao.top/comment/comment',
      method:'POST',
      data:{
        "content":content,
        "school_type":0,
        "school_id":that.data.objData.school_news_id
      },
      header: {"auth":wx.getStorageSync("login_key")},
      success: (res) => {
        if (res.data.status=='200'){
          wx.showToast({
            title: "评论发送成功",
            icon: "none",
            duration: 1500,
            mask: true
          });
          this.commentData();
        }else{
          wx.showToast({
            title: "评论发送失败失败",
            icon: "none",
            duration: 1500,
            mask: true
          });
        }
      }
    })
  },
  /**请求评论数据 */
  commentData:function(){
   // console.log(this.data.comments);
    wx.request({
      url: 'https://www.younghao.top/comment/listOneComment',
      method:'POST',
      data:{
        "key":0,
        "school_id":this.data.objData.school_news_id
      },
      header:{"auth":wx.getStorageSync("login_key")},
      success:(res) =>{

       //var len = res.data.
        this.setData({
          comments:res.data.comments,
          responseLength:res.data.Length
        });
       // console.log(res.data.comments)
        this.commentTime()
        this.isShowComment();
        this.isShowChildComment();
     //   console.log(this.data.comments);
      },
      fail: (res) =>{
        wx.showToast({
          title: '数据请求失败请重试',
          icon:"none",
          duration:1500,
          mask:true
        })
      }
    })
  },
  /**提交子评论 */
  childCommentformSubmit: function (e) {
    //  console.log(e);
     // console.log(this.data.objData);
      var mainId = e.currentTarget.dataset.mainid;
      var replyid = e.currentTarget.dataset.replyid;
      var content = e.detail.value.content;
      var that = this;
      if (content == '') {
        wx.showToast({
          title: "评论不能为空",
          icon: "none",
          duration: 1500,
          mask: true
        });
        return;
      }
      wx.request({
        url: 'https://www.younghao.top/comment/reply',
        method: 'POST',
        data: {
          "content": content,
          "replyId": replyid,
          "mainCommentId": mainId,
          "school_id": that.data.objData.school_news_id,
          "school_type":0,
        },
        header: { "auth": wx.getStorageSync("login_key") },
        success: (res) => {
          if (res.data.status == '200') {
            wx.showToast({
              title: "评论发送成功",
              icon: "none",
              duration: 1500,
              mask: true
            });
            this.commentData();
          } else {
            wx.showToast({
              title: "评论发送失败失败",
              icon: "none",
              duration: 1500,
              mask: true
            });
          }
          that.setData({
            maskFlag : true
          });
        }
      })
    } ,
    /**处理评论的时间格式 */
  commentTime:function(){
    var comments = this.data.comments;
    var times = comments;
    for(var i=0;i<times.length;i++){
        var time = util.formatTime(new Date(times[i].school_comment_time));
        times[i].school_comment_time = time;
        var replys = times[i].replys;
        for (var j = 0; j < replys.length;j++){
            var t = util.formatTime(new Date(replys[j].school_comment_time));
            replys[j].school_comment_time = t;
        }
    }
    this.setData({
        comments: times
    })
  },
  /**点击评论状态初始化设置 */
  isShowComment:function(){
      var that = this;
      var comments = that.data.comments;
      var isShowComments = {};
      for(var i=0;i<comments.length;i++){
        isShowComments[comments.school_comment_id+''] = false;
      }
      that.setData({
        isShowComments: isShowComments
      })
  },
  /** 点击子评论状态初始化设置 */
  isShowChildComment:function(){
    var that = this;
    var comments = that.data.comments;
    var isShowChildComments = {};
    for (var i = 0; i < comments.length; i++) {
      var show = {};
    //  console.log(comments[i]);
      if(comments[i].replys.length==0){
        continue;
      }
      for(var j=0;j<comments[i].replys.length;j++){
        show[comments[i].replys[j].school_comment_id+''] = false;
      }
    //  console.log(show);
      isShowChildComments[comments[i].school_comment_id + ''] = show;
    }
  //  console.log(isShowChildComments)
    that.setData({
      isShowChildComments: isShowChildComments
    });
  },
  /**展开回复 / 收起回复按钮的实现 */
  commentReply:function(e){
    var open = new Array();
    var index = e.currentTarget.dataset.index;
  //  console.log(e);
    open[index] = !this.data.open[index];
    this.setData({
      open:open
    })
  },
  /*获取点赞信息 */
  getHeart:function(){
    wx.request({
      url: 'https://www.younghao.top/heart/getHearts',
      method:'POST',
      data:{
        "school_type":0,
        "school_id":this.data.objData.school_news_id
      },
      header: {"auth":wx.getStorageSync("login_key")},
      success:(res)=>{
        this.setData({
          heartData:res.data.users
        })
        var length = this.data.heartData.length;
        var heartData = this.data.heartData;
        var heartImg = [];
        for(var i=0;i<length;i++){
            heartImg.push(heartData[i].school_user_info_avatarUrl)
        }
        this.setData({
          heartImg:heartImg
        })
      },
    })
    /**展示显示区 */
    this.setData({
      isShowResponse:false,
      isShowHeart:true
    })
  },
  /**显示评论区 */
  isShowResponse:function(){
    this.setData({
      isShowResponse:true,
      isShowHeart:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();             
    eventChannel.on("schoolDetail", data =>{                //接收传递的数据
      that.setData({
        objData:data.objData,
        show:data.show
      },data =>{
        that.commentData();
      });  
      this.lineFeed();
      this.countPeople();
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})