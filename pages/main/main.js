// pages/main.js
const app = getApp()
Page({
  data:{
    type:11,
    objData:[]
  },
  cSchoolListener: function(e){
    /*console.log("e.detail",e.detail);*/
    var that = this;
    if(e.detail == 0){
     /* this.setData({
        type: e.detail
      })
      that.getSchoolData(this.data.type,'/pages/school/school');*/
      wx.navigateTo({
        url: '/pages/school/school',
      })
    }else if(e.detail == 1){
      wx.navigateTo({
        url: '/pages/experience/experience',
      })
    }else if(e.detail == 2){
      wx.navigateTo({
        url: '/pages/book/book',
      })
    }else if(e.detail == 3){
      this.setData({
        type: e.detail
      })
      wx.navigateTo({
        url: '/pages/devote/devote',
      })
    }else if(e.detail == 4){
      this.setData({
        type: e.detail
      })
      wx.navigateTo({
        url: '/pages/loose/Loose',
      })
    }else if(e.detail == 5){
      this.setData({
        type: e.detail
      })
      wx.navigateTo({
        url: '/pages/news/news',
      })
    }
  },
  edit:function(e){
    wx.navigateTo({
      url: '/pages/litter-img/edit/edit',
    })
  },
  leavemessage:function(e){
    wx.navigateTo({
      url: '/pages/litter-img/message/message',
    })
  },
  /*获取校园时事的数据 */
  getSchoolData:function(type,url){
    var that = this;
    //console.log(that.data.type)
    wx.request({
      url: 'https://www.younghao.top/data/data?key='+type,
      method:'GET',
      header:  {"auth":wx.getStorageSync("login_key")},
      success:(res) =>{
        console.log(res);
        that.setData({
          objData:res.data.promise
        })
        wx.navigateTo({
          url:url,
          success:function(res){
            console.log(that.data.objData);
            res.eventChannel.emit('Data',that.data.objData);
          }
        })
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
  }
})
