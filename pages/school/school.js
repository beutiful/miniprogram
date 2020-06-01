// pages/school/school.js
const util = require('../../utils/util.js')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    objData:[],
    showData:[],
    like_essay:[],
    isShow:{}
  },
  /**跳转到详情页 */
  drop:function(e){
    var index = e.currentTarget.dataset.index;
    var id = this.data.showData[index].school_news_id;
    var show = this.data.isShow[id];
    console.log(this.data.showData[index]);
    console.log(this.data.objData);
    console.log(this.data.like_essay);
    var obj ={
      show:show,
      objData:this.data.showData[index]
    }
    wx.navigateTo({
      url: '/pages/school/childSc/Sdetail',
      success:(res) =>{
        res.eventChannel.emit('schoolDetail',obj);
      }
    })
  },
  /*改变图片的地址（从字符串变为数组）/ 改变时间的显示格式 */
   changeImage:function(){
    var that = this;
    /*将服务器返回的图片（一串字符串） 转为数组存储起来，方便图片的使用 */
    var trueData = that.data.objData;                      //将objData赋值给TrueData       
 //   console.log(trueData);
    var showData = [];
    for(var i=0;i<trueData.length;i++){
      /**处理文章的时间 */
      var time = util.formatTime(new Date(trueData[i].school_news_date));

      var str = trueData[i].school_news_path;            //获取数组中每个对象中的全部图片
      var s_str = str.split(",");                         //将图片字符串按，分隔开
      // console.log(s_str);
      if(s_str.length>0){                                //当有图片的时候
        showData[i] = trueData[i];                       //将数据赋值给showData中
        showData[i].school_news_path = s_str;           //将数组型的图片地址赋值到showData中
        showData[i].school_news_date = time;            //转换时间形式
      }else{
        showData[i] = trueData[i];                       //没有图片时，将将原数据赋值回去
        showData[i].school_news_date = time;            //转换时间形式
      }
      }
      that.setData({
        showData: showData
      })
      /**初始化点赞的状态组 */
      var isShow = {};
      for (var i = 0; i < that.data.showData.length; i++) {
      for(var j=0;j<that.data.like_essay.length;j++){
        if(that.data.showData[i].school_news_id == that.data.like_essay[j].school_essay_id){
          isShow[that.data.showData[i].school_news_id] = true
          }
        }
      }
      that.setData({
        isShow : isShow
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.request({
      url: 'https://www.younghao.top/data/data?key=0',
      method:'GET',
      header:  {"auth":wx.getStorageSync("login_key")},
      success:(res) =>{
        this.setData({
          objData: res.data.promise,
          like_essay:res.data.like_essay
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
  //  console.log('-----------------------onShow---------------------')
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
   // console.log('-----------------------onHide---------------------')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
 //   console.log('-----------------------onUnload---------------------')
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