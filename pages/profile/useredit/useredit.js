// pages/useredit/useredit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isStudent:true,
    userInfo:{}
  },
  /**改变状态（是否是学生） */
  radioChange:function(e){
    if(e.detail.value == 1){
      this.setData({
        isStudent :false
      })
    }else{
      this.setData({
        isStudent :true
      })
    }
  },
  formSubmit:function(e){
    console.log(e);
    console.log(this.data.isStudent);
    var state = 2;  //状态
    var schoolId = 0; //学号
    if(e.detail.value.isStudent == 0){
      schoolId = e.detail.value.number;
    }else{
      state = e.detail.value.state;
      schoolId = 0;
    }
    console.log(state);
    wx.request({
      url: 'https://www.younghao.top/users/savePersonalMessage',
      method:'POST',
      header: {"auth":wx.getStorageSync("login_key")},
      data:{
        'isStudent':e.detail.value.isStudent,
        'name':e.detail.value.name,
        'schoolId':schoolId,
        'mobel':e.detail.value.mobel,
        'isSex':e.detail.value.isSex,
        'state':state
      },
      success:(res)=>{
        console.log(res);
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
        var userInfo = res.userInfo
        that.setData({   
          userInfo:userInfo
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