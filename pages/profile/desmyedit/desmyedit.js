// pages/profile/desmyedit/desmyedit.js
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
    responseLength:0, //评论数
    type:0,           //文章类型
    school_id:0,      //文章id
    likePromise:[], //点赞状态
    isShowResponse:true, //显示回复信息
    isShowHeart:false,    //显示点赞信息
    heartData:[], //点赞数据
    heartImg:[]  //点赞数据中的用户头像
  },
   /*点赞图片切换 */
   changeimg:function(e){
    var action = '';
      var showImg = this.data.show;
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
            "school_type":this.data.type,
            "school_id":this.data.school_id,
          },
          header: {"auth":wx.getStorageSync("login_key")},
          success: (res) => {
            console.log('success');
          }
        })
      })
  },
  /**放大图片 */
  previewImg: function(e){
    var index = e.currentTarget.dataset.index;
    // 设置预览图片路径
    wx.previewImage({
      current: this.data.objData.school_path[index],
      urls: this.data.objData.school_path  
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
   /*处理文章中的空格 */
  lineFeed:function(){
   // console.log(this.data.objData.school_path);
    var content = (this.data.objData.school_content).replace(/\/n/g,"\n");
    this.setData({
      content:content
    })
  },
  /**修改浏览人数 */
  countPeople:function(){
    /**判断修改哪一个表 */
    var type = this.data.type;
    var table = '';
    if(type == 0){
      table = 'school_news'
    }else if(type == 1){
      table = 'school_experience'
    }else if(type == 2){
      table = 'school_book'
    }else if(type == 3){
      table = 'school_devote'
    }else if(type == 4){
      table = 'school_found'
    }else{
      table = 'school_employ'
    }
    wx.request({
      url:'https://www.younghao.top/people/people',
      method: 'POST',
      data:{
        "table":table,
        "school_news_id":this.data.school_id,
        "school_news_people":this.data.school_people
      },
      header: {"auth":wx.getStorageSync("login_key")},
      success: (res) => {
        if (res.data.status=='200'){
          console.log("success");
        }else{
          console.log("fail");
        }
      }
    })
},
/**提交评论表单（文章） */
formSubmit:function(e){
  console.log(e);
  console.log(this.data.objData);
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
      "school_type":that.data.type,
      "school_id":that.data.school_id
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
      "school_id": that.data.school_id,
      "school_type":this.data.type,
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
/**获取评论信息 */
commentData:function(){
  wx.request({
    url: 'https://www.younghao.top/comment/listOneComment',
    method:'POST',
    data:{
      "key":this.data.type,
      "school_id":this.data.school_id
    },
    header:{"auth":wx.getStorageSync("login_key")},
    success:(res) =>{
      console.log(res)
      this.setData({
        comments:res.data.comments
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
/*请求数据 */
requestData:function(){
  wx.request({
    url: 'https://www.younghao.top/data/detailData',
    method:'POST',
    data:{
      "type":this.data.type,
      "school_id":this.data.school_id
    },
    header: {"auth":wx.getStorageSync("login_key")},
    success:(res)=>{
    //  console.log(res);
      this.setData({
        objData:res.data.promise[0],
        responseLength:res.data.responseLength, 
        likePromise:res.data.likePromise
      })
      this.changeImage();
      this.commentData();
      this.lineFeed();     /*处理文章中的空格 */
      this.countPeople();
    },
  })
},
 /*改变图片的地址（从字符串变为数组）/ 改变时间的显示格式 */
 changeImage:function(){  
  var that = this;
  /*将服务器返回的图片（一串字符串） 转为数组存储起来，方便图片的使用 */
  var trueData = that.data.objData;                      //将objData赋值给TrueData       
  var showData = {};

  var time = util.formatTime(new Date(trueData.school_time));
  var str = trueData.school_path;            //获取数组中每个对象中的全部图片
  var s_str = str.split(",");                         //将图片字符串按，分隔开
  if(s_str.length>0){                                //当有图片的时候
    showData = trueData;                       //将数据赋值给showData中
    showData.school_path = s_str;           //将数组型的图片地址赋值到showData中
    showData.school_time = time;            //转换时间形式
  }else{
    showData = trueData;                       //没有图片时，将将原数据赋值回去
    showData.school_time = time;            //转换时间形式
  }
  that.setData({
    objData: showData
  })
  /**初始化点赞的状态组 */
  var show = false; 
  if(this.data.likePromise.length == 0){   /**点赞的话school_like有该用户点赞的信息，没有的话则为0 */
    show = false;
  }else{
    show = true;
  }
  that.setData({
    show : show
  })
},
/*获取点赞信息 */
getHeart:function(){
//  console.log('click');
  wx.request({
    url: 'https://www.younghao.top/heart/getHearts',
    method:'POST',
    data:{
      "school_type":this.data.type,
      "school_id":this.data.school_id
    },
    header: {"auth":wx.getStorageSync("login_key")},
    success:(res)=>{
    //  console.log(res);
      this.setData({
        heartData:res.data.users
      })
      var length = this.data.heartData.length;
      var heartData = this.data.heartData;
      var heartImg = [];
     // console.log(heartData);
      for(var i=0;i<length;i++){
          heartImg.push(heartData[i].school_user_info_avatarUrl)
      }
      this.setData({
        heartImg:heartImg
      })
    //  console.log(heartImg);
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
//删除评论
deleteMyreponse:function(res){
  console.log(res);
  var id = res.currentTarget.dataset.id;
  var that = this;
  wx.showModal({
    title: '删除提示',
    content: '确认删除该评论吗',
    success (res) {
      if (res.confirm) {
        console.log('删除成功');
        wx.request({
          url: 'https://www.younghao.top/comment/deleteComment',
          method:"POST",
          header: {"auth":wx.getStorageSync("login_key")},
          data:{
            type:that.data.type,
            id:id
          },
          success:(res)=>{
              that.commentData();
          }
        })
      } else if (res.cancel) {
       // console.log('用户点击取消')
      }
    }
  })
},
deleteMyreponseChild:function(res){
  console.log(res);
  var id = res.currentTarget.dataset.id;
  var that = this;
  wx.showModal({
    title: '删除提示',
    content: '确认删除吗',
    success (res) {
      if (res.confirm) {
        console.log('删除成功');
        wx.request({
          url: 'https://www.younghao.top/comment/deleteComment',
          method:"POST",
          header: {"auth":wx.getStorageSync("login_key")},
          data:{
            type:that.data.type,
            id:id
          },
          success:(res)=>{
              that.commentData();
          }
        })
      } else if (res.cancel) {
       // console.log('用户点击取消')
      }
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    const eventChannel = this.getOpenerEventChannel();             
    eventChannel.on("requestData", data =>{                 //接收传递的数据
      that.setData({
        type:data.type,
        school_id:data.school_id
      },data =>{
      //  console.log(this.data.type,this.data.school_id);
        that.requestData();
      });  
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