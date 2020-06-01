// pages/pro/pro.js
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    messageNumber:-1, //我的回复
    response:false,   //是否显示回复的新消息提示
    editShow:false,
    responseShow:false,
    myeditData:{},   //发布的数据
    time:[],
    objData:[],      //点击的文章信息
    like_essay:[],  //点赞的信息
    responseLength:0, //回复的信息的长度
    isShow:{},
    type:0,
    school_id:0,
    commentData:[],        //我的回复里的数据
    showCommentData:[],      //修改时间格式后的我的回复里的数据
    ids:''                 //改变状态的id字符串
    },
    /*编辑个人信息 */
  edit:function(e){
    wx.navigateTo({
      url: '/pages/profile/useredit/useredit',
    })
  },
  /*我的回复 */
  myresponse:function(){
   //console.log('click');
    this.setData({
      editShow:false,
      responseShow:true
    })
    wx.request({
   // url: 'https://www.younghao.top/personal/personalReplyData',
      url:'https://www.younghao.top/comment/listUserComments',
      method:'GET',
      header: {"auth":wx.getStorageSync("login_key")},
      success:(res)=>{
       // console.log(res);
        this.setData({
          commentData:res.data.comments
        })
        this.myresponseTime();
        var len = this.data.commentData.length;
        var ids =[];
        for(var i=0;i<len;i++){
          ids.push(this.data.commentData[i].school_comment_id)
        }
        console.log(ids);
        ids = ids.toString();
        this.setData({
          ids:ids
        })
        this.changeStatus();//改变读取的状态
      },
    })
  },
  /**点击我的发布出现发布文章展示区 */
  myedit:function(){
    this.setData({
      editShow:true,
      responseShow:false
    })
    wx.request({
      url: 'https://www.younghao.top/personal/personalSubmitEassay',
      method:'GET',
      header: {"auth":wx.getStorageSync("login_key")},
      success:(res)=>{
        this.setData({
          myeditData:res.data.data
        })
        this.commentTime()
        // console.log(this.data.myeditData);
      },
    })
  },
  /**展示发布的文章的详情信息*/
  myeditdetail:function(e){
  //  console.log(e);
    var typeName =e.currentTarget.dataset.type;
    //console.log(typeName);
    var type = 0;
    if(typeName == "校园时事"){
      type = 0;
    }else if(typeName == "嘉经验"){
      type = 1;
    }else if(typeName == "二手书城"){
      type = 2;
    }else if(typeName == "爱心捐献"){
      type = 3
    }else if(typeName == "失物招领"){
      type = 4
    }else if(typeName == "兼职招新"){
      type = 5
    }
    this.setData({
      type:type,
      school_id:e.currentTarget.dataset.id
    })
  //  console.log(this.data.type,this.data.school_id);
    var requestData = {
      type:this.data.type,
      school_id:this.data.school_id
    }
    wx.navigateTo({
      url: '/pages/profile/desmyedit/desmyedit',
      success:(res) =>{
        res.eventChannel.emit('requestData',requestData);
      }
    })
  },
  /**我的回复的详情页 */
  myresponsDetail:function(e){
    console.log(e);
    var requestData = {
      type:e.currentTarget.dataset.type,
      school_id:e.currentTarget.dataset.id
    }
    wx.navigateTo({
      url: '/pages/profile/desmyedit/desmyedit',
      success:(res) =>{
        res.eventChannel.emit('requestData',requestData);
      }
    })
  },
    /**处理评论的时间格式（myedit） */
  commentTime:function(){
    var comments = this.data.myeditData;
    var times = comments;
    var length =  times.length;
    for(var i=0;i<length;i++){
        var time = util.formatDate(new Date(times[i].time));  
        times[i].time = time;
        }
    this.setData({
      time: times
    })
  },
  /**我的回复--处理时间格式(myresponse) */
  myresponseTime:function(){
    var length = this.data.commentData.length;
    var showComment = this.data.commentData;
    for(var i=0;i<length;i++){
      var time = util.formatTime(new Date(showComment[i].school_comment_time)); 
      showComment[i].school_comment_time = time;
      }
    this.setData({
      showCommentData:showComment
    })
   // console.log(this.data.showCommentData);
  },
/**改变读取的状态 */
  changeStatus:function(){
    wx.request({
      url: 'https://www.younghao.top/comment/setMessageRead',
      method:'POST',
      data:{
        "id":this.data.ids
      },
      header: {"auth":wx.getStorageSync("login_key")},
      success:(res)=>{
        console.log(res);
      },
    })
  },
  /**图片详情 */
  imgDetail:function(){

  },
  deleteMyedit:function(res){
    var typeName =res.currentTarget.dataset.type;
    var that = this;
    var type = 0;
    var id = res.currentTarget.dataset.id;
    if(typeName == "校园时事"){
      type = 0;
    }else if(typeName == "嘉经验"){
      type = 1;
    }else if(typeName == "二手书城"){
      type = 2;
    }else if(typeName == "爱心捐献"){
      type = 3
    }else if(typeName == "失物招领"){
      type = 4
    }else if(typeName == "兼职招新"){
      type = 5
    }
    wx.showModal({
      title: '删除提示',
      content: '确认删除吗',
      success (res) {
        if (res.confirm) {
          console.log('删除成功');
          wx.request({
            url: 'https://www.younghao.top/data/deleteData',
            method:"POST",
            header: {"auth":wx.getStorageSync("login_key")},
            data:{
              type:type,
              id:id
            },
            success:(res)=>{
                that.myedit();
            }
          })
        } else if (res.cancel) {
         // console.log('用户点击取消')
        }
      }
    })
  },
  deleteMyreponse:function(res){
    console.log(res);
    var type = res.currentTarget.dataset.type;
    var id = res.currentTarget.dataset.commentid;
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
              type:type,
              id:id
            },
            success:(res)=>{
                that.myresponse();
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
    var that = this
    wx.getUserInfo({
      success: function(res) {
        console.log(res);
        var userInfo = res.userInfo
        that.setData({   
          userInfo:userInfo
        })
      }
    })
    wx.request({
    //  url: 'https://www.younghao.top/personal/personalData',
      url:'https://www.younghao.top/comment/listUserCommentsNum',
      method:'GET',
      header: {"auth":wx.getStorageSync("login_key")},
      success:(res)=>{
     //   console.log(res)
        var response = false;
        var messageNumber = res.data.num;
        if(messageNumber == 0){
          response = false;
        }else{
          response = true;
        }
        this.setData({
          messageNumber:messageNumber,
          response:response
        })
      },
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