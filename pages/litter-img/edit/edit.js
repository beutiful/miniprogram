// pages/edit/edit.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    array:[['校园时事','嘉经验','二手书城','爱心捐献','失物招领','兼职招新'],['全部']],
    multiIndex:[0,0],
    index:0,
    imgPath:[],
    imageTruePath:[],
    uploadIndex:0,
    isShow:true
  },
  /**选择图片 */
  selectImg: function () {
    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        //res.tempFilePaths 返回图片本地文件路径列表
        var tempFilePaths = res.tempFilePaths;
        if(that.data.imgPath.length + tempFilePaths.length>9){
          wx.showToast({
            title: '只能上传9张图片哦',
            icon:"none",
            duration:1500,
            mask:true
          })
          imgPath:[];
          return ;
        }
        var temPaths = that.data.imgPath;
        for(var index = 0; index<tempFilePaths.length;index++){
          temPaths.push(tempFilePaths[index])
        }
        that.setData({
        //  imgPath: tempFilePaths         //?
            imgPath:temPaths
        })
        that.loadImg();
      }
    })    
  },
  /**在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作 */
  previewImg: function(e){
    var index = e.currentTarget.dataset.index;
    console.log(index)
    // 设置预览图片路径
    wx.previewImage({
      current: this.data.imgPath[index],
      urls: this.data.imgPath   
     })
  },
  /*删除图片 */
  deleteImg:function(e){
    var that = this;
    var imgs = this.data.imgPath;
    var imgsTruePath = that.data.imageTruePath;
    var index = e.currentTarget.dataset.index;
    var next = that.data.uploadIndex;
    wx.showModal({
      title: '提示',
      content: '确定要删除该图片吗?',
      success (res) {
        if (res.confirm) {
          imgs.splice(index,1);
          that.setData({
            imgPath:imgs,
          })
          imgsTruePath.splice(index, 1);
          that.setData({
            imageTruePath: imgsTruePath,
          })
          next = next - 1;
          that.setData({
            uploadIndex: next,
          })
          console.log(that.data.imageTruePath)
        } else {
          return ;
        }
      },
      fail(res){
        wx.showToast({
          title: '删除失败请重试',
          icon: 'success',
          duration: 2000
        })
      }
    })

  },

  /*上传图片 */
  loadImg: function () {
    var that = this;
    var index = that.data.uploadIndex;
    if (that.data.uploadIndex == that.data.imgPath.length) {
      console.log(that.data.imageTruePath)
      wx.showToast({
        title: "图像上传成功！",
        icon: "",
        duration: 1500,
        mask: true
      });
      return;
    }
    wx.uploadFile({
      url: "https://www.younghao.top/upload/picture",
      filePath: (that.data.imgPath)[index],
      name: "upload_file",
      // 请求携带的额外form data
      /*formData: {
        "id": id
      },*/
      header: {
        'Content-Type': "multipart/form-data"
      },
      success: function (res) {
        //console.log(filePath);
        var obj = JSON.parse(res.data);
        console.log("res"+res.data);
        var next = that.data.uploadIndex + 1;
        that.setData({
          uploadIndex: next
        })
        var imgTruePaths = that.data.imageTruePath;
        imgTruePaths.push(obj.path);
        that.setData({
          imageTruePath: imgTruePaths
        })
        that.loadImg();
       // that.data.imageTruePath = obj.path;
      // that.data.imageTruePath = obj.data;*/
      },
      fail: function (res) {
        console.log(res);
        wx.showToast({
          title: "上传失败，请检查网络或稍后重试。",
          icon: "none",
          duration: 1500,
          mask: true
        });
      /*  that.setData({
          imgPath:''
        })*/
      }
    })
  },
  /*提交表单信息 */
  formSubmit: function(e){
    var that = this;
   /* console.log('form发生了submit事件，携带数据为：', e)*/
    var obj = e.detail.value
    /**注意：数据库存储图片是一个字符串，不能是数组 */
    var path = '';
    if(that.data.imgPath.length!=that.data.imageTruePath.length){
      wx.showToast({
        title: "图片正在上传，请稍等",
        icon: "none",
        duration: 1500,
        mask: true
      });
      return;
    }
    for(var index = 0; index < that.data.imageTruePath.length ; index++){
       path = path + that.data.imageTruePath[index]
       if(index!=that.data.imageTruePath.length-1){
         path = path + ','
       }
    }
    obj.path = path
    if(obj.title==''){
      wx.showToast({
        title: "标题不能为空",
        icon: "none",
        duration: 1500,
        mask: true
      });
      return;
    }
    if (obj.content == '') {
      wx.showToast({
        title: "内容不能为空",
        icon: "none",
        duration: 1500,
        mask: true
      });
      return;
    }
    wx.request({
      url:'https://www.younghao.top/edit/add',
      method: 'POST',
      data:{ 
            "title":e.detail.value.title,
            "content":e.detail.value.content,
            "path":e.detail.value.path,
            "FirstType":e.detail.value.type[0],
            "SecondType":e.detail.value.type[1]},
      header: {"auth":wx.getStorageSync("login_key")},
      success: (res) => {
        console.log("res",res)
        if (res.data.status=='200'){
          wx.showToast({
            title: "保存成功",
            icon: "none",
            duration: 1500,
            mask: true
          });
      //    wx.navigateBack({})
        }else{
          wx.showToast({
            title: "保存失败",
            icon: "none",
            duration: 1500,
            mask: true
          });
        }
      }
    })
  },
  formReset:function(e){
    this.setData({
      imgPath:''
    })
  },
  /*选择分类显示分类类型 */
  bindpicker:function(e){
    console.log("发送改变，携带值为",e.detail.value)
    this.setData({
      multiIndex:e.detail.value
    })
  },
  bindMultiPickerColumnChange:function(e){
  /* var column = e.detail.column;
    var value = e.detail.value; */ 
  /*响应式出现不同的编辑页，二手书城、失物招领、兼职招新没有标题 */
  /*  if(column == 0 && ( value == 2 || value == 4 )){
      this.setData({
        isShow: false
      })
    } else if(column == 0 && ( value == 0 || value == 1  || value == 3 || value == 5)){
      this.setData({
        isShow:true
      })
    }*/ 
    /**两行选择列 */
    var data ={
      multiArray:this.data.array,
      multiIndex:this.data.multiIndex
    };
    //获取第几个列在修改
    data.multiIndex[e.detail.column] = e.detail.value;
    //分情况来改
    switch(e.detail.column){
      //第一列
      case 0:{
        //第几行
        switch(data.multiIndex[0]){
          case 0:
            data.multiArray[1] = ['全部'];
            break;
          case 1:
            data.multiArray[1] = ['学习','生活','工作'];
            break;
          case 2:
            data.multiArray[1] = ['买书','卖书'];
            break;
          case 3:
            data.multiArray[1] = ['全部'];
            break;
          case 4:
            data.multiArray[1] = ['失物','招物'];
            break;
          case 5:
            data.multiArray[1] = ['全部'];
            break;
        }
      }
    break;
  }
  this.setData({
    array:data.multiArray,
  });
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