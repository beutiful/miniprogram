// pages/litter-img/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:''  //textarea中的值
  },
  formSubmit:function(e){
   // console.log(e);
    this.data.info = e.detail.value;
    wx.request({
      url: 'https://www.younghao.top/suggest/suggest',
      method:'POST',
      data:e.detail.value,
      header: {"auth":wx.getStorageSync("login_key")},
      success:(res) => {
        console.log(res)
        if(res.data.status == "200"){
          wx.showToast({
            title: '发送成功',
            icon:"none",
            duration:1500,
            mask:true
          })
        }else{
          wx.showToast({
            title: '发送失败请重试',
            icon:"none",
            duration:1500,
            mask:true
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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