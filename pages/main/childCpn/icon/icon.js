// pages/main/childCpn/icon/icon.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },
  /**
   * 组件的初始数据
   */
  data: {
    items:[ 
    {image:"/assets/container/school.png",value:"校园时事"},
    {image:"/assets/container/jia.png",value:"嘉经验"},
    {image:"/assets/container/cart.png",value:"二手书城"},
    {image:"/assets/container/devote.png",value:"爱心捐献"},
    {image:"/assets/container/loose.png",value:"失物招领"},
    {image:"/assets/container/news.png",value:"兼职招新"}],
  },

  /**
   * 组件的方法列表
   */
  methods: {
    school: function(e){
    // var cSchoolDetail = {} //提供给事件监听函数
    // var cSchoolOption = {} //触发事件的选项
    //console.log(e.currentTarget)
     this.triggerEvent('cschool', e.currentTarget.dataset.idx)
    }
  }
})
