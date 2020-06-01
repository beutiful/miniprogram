// pages/news.js
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    length:0,
    objData:[],
    showData:[],
    like_essay:[],
    isShow:{},
    whichheart:0,       //判断是原本模块点赞/取消 还是搜索之后点赞/取消  方便后面刷新页面 默认是原版模块
    responseLength:[] //评论数
  },
  /*跳转详情页 */
  drop:function(e){
    var index = e.currentTarget.dataset.index;
    var id = this.data.showData[index].school_employ_id;
    var show = this.data.isShow[id];
    var responseLength = this.data.responseLength[id]
    var obj ={
      show:show,
      objData:this.data.showData[index],
      responseLength:responseLength
    }
    wx.navigateTo({
      url: '/pages/news/desnews/desnews',
      success:(res) =>{
        console.log(this.data.showData[index]);
        res.eventChannel.emit('employDetail',obj);
      }
    })
  },
  /*点赞图片切换 */
  changeimg:function(e){
    var action = '';
    var setIndex = e.currentTarget.dataset.id;
    var heartdata = null;
    var isShowHeart = null;
    for(var i=0;i<this.data.showData.length;i++){
      console.log(this.data.showData[i]);
      if (this.data.showData[i].school_employ_id == setIndex){
        heartdata = this.data.showData[i];
        isShowHeart = this.data.isShow[setIndex];
        break;
      }
    }
    var show = this.data.isShow;
    if (isShowHeart == false || isShowHeart == null){
      show[heartdata.school_employ_id] = true;
      action = 'success';
      wx.showToast({
        title: "点赞成功",
        icon: "none",
        duration: 1500,
        mask: true
      });
    }else{
      show[heartdata.school_employ_id] = false;
      action = 'cancel';
      wx.showToast({
        title: "取消点赞",
        icon: "none",
        duration: 1500,
        mask: true
      });
    }
    this.setData({
      isShow: show
    },heart =>{
      wx.request({
        url: 'https://www.younghao.top/heart/heart',
        method:'POST',
        data:{
          "action":action,
          "school_type":5,
          "school_id":heartdata.school_employ_id,
        },
        header: {"auth":wx.getStorageSync("login_key")},
        success: (res) => {
        //判断是搜索模块点赞还是原来点赞
          if(this.data.whichheart == 0){
            this.onLoad();
          }else if(this.data.whichheart == 1){
            wx.request({
              url: 'https://www.younghao.top/data/queryData',
              method:'POST',
              data:{
                "key":5,
                "eassayName":this.data.searchValue
              },
              header: {"auth":wx.getStorageSync("login_key")},
              success:(res)=>{
                this.setData({
                  objData:res.data.promise,
                  length:res.data.promise.length,     //模块长度
                  like_essay:res.data.like_essay      //点赞信息
                })  
                this.changeImage();  
              },
              fail: (res) =>{
                wx.showToast({
                  title: '数据搜索失败',
                  icon:"none",
                  duration:1500,
                  mask:true
                })
              }
            })
          }    
        }
      })
    })
  },
  /*改变图片的地址（从字符串变为数组）/ 改变时间的显示格式 */
  changeImage:function(){
    var that = this;
    /*将服务器返回的图片（一串字符串） 转为数组存储起来，方便图片的使用 */
    var trueData = that.data.objData;                      //将objData赋值给TrueData
  //  console.log(trueData);
    var showData = [];
    for(var i=0;i<trueData.length;i++){
      /**处理文章的时间 */
      var time = util.formatTime(new Date(trueData[i].school_employ_time));

      var str = trueData[i].school_employ_image;            //获取数组中每个对象中的全部图片
      var s_str = str.split(",");                         //将图片字符串按，分隔开
      if(s_str.length>0){                                //当有图片的时候
        showData[i] = trueData[i];                       //将数据赋值给showData中
        showData[i].school_employ_image = s_str;//将数组型的图片地址赋值到showData中
      }else{
        showData[i] = trueData[i];                     //没有图片时，将将原数据赋值回去
      }
      showData[i].school_employ_time = time;            //转换时间形式
      }
      that.setData({
        showData: showData,
      })
      /**初始化点赞的状态组 */
      var isShow = {};
      for (var i = 0; i < that.data.showData.length; i++) {
        for(var j=0;j<that.data.like_essay.length;j++){
          if(that.data.showData[i].school_employ_id == that.data.like_essay[j].school_essay_id){
            isShow[that.data.showData[i].school_employ_id] = true
          }
        }
      }
      that.setData({
        isShow : isShow
      })
  },
    /**搜素功能板块 */
  formSubmit:function(e){
    var searchValue = e.detail.value.search;
    console.log(searchValue);
    this.setData({
      searchValue:searchValue
    })
    wx.request({
      url: 'https://www.younghao.top/data/queryData',
      method:'POST',
      data:{
        "key":5,
        "eassayName":searchValue
      },
      header: {"auth":wx.getStorageSync("login_key")},
      success:(res)=>{
        var whichheart = 1;
        if(e.detail.value.search == " "){
          whichheart = 0;
        }
        this.setData({
          whichheart:whichheart,
          objData:res.data.promise,
          length:res.data.promise.length,     //模块长度
          like_essay:res.data.like_essay,      //点赞信息
          responseLength:res.data.response_length  //评论数
        })
        this.changeImage();    
      },
      fail: (res) =>{
        wx.showToast({
          title: '数据搜索失败',
          icon:"none",
          duration:1500,
          mask:true
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'https://www.younghao.top/data/data?key=5',
      method:'GET',
      header:  {"auth":wx.getStorageSync("login_key")},
      success:(res) =>{
        console.log(res);
        this.setData({
          objData:res.data.promise,
          length:res.data.promise.length,
          like_essay:res.data.like_essay,
          responseLength:res.data.response_length  //评论数
        });
        this.changeImage();
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //页面刷新
    if(this.data.whichheart == 0){
      this.onLoad();
    }else if(this.data.whichheart == 1){
      wx.request({
      url: 'https://www.younghao.top/data/queryData',
      method:'POST',
      data:{
        "key":5,
        "eassayName":this.data.searchValue
      },
      header: {"auth":wx.getStorageSync("login_key")},
      success:(res)=>{
        this.setData({
          objData:res.data.promise,
          length:res.data.promise.length,     //模块长度
          like_essay:res.data.like_essay,      //点赞信息
          responseLength:res.data.response_length  //评论数
        })  
        this.changeImage();  
      },
      fail: (res) =>{
        wx.showToast({
          title: '数据搜索失败',
          icon:"none",
          duration:1500,
          mask:true
        })
      }
    })
  }  
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