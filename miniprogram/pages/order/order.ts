Page({
  data: {
    // 商品信息
    courseId:"",
    goods: {
      images: ["/images/tour.jpg"],
      name: "丽江古城三日文化之旅",
      desc: "深度体验纳西文化，包含特色民宿住宿",
      location: "云南·丽江",
      duration: "3天2晚",
      price: 2680
    },
    totalPrice:0,
    selectedTravelers: [], // 默认选中ID为1的出行人
    selectedGuardians: [1],
    // 出行人列表
    travelers: [
      { id: 1, name: "张三", phone: "138****1234" },
      { id: 2, name: "李四", phone: "139****5678" }
    ],

    // 监护人列表
    guardians: [
      { id: 3, name: "王五", phone: "136****9012" }
    ]
  },
  onShow(){
    this.loadData()
  },
  loadData(){

    let courseId = this.data.courseId
    this.setData({
      travelers:getApp().globalData.baseInfo.travelers,
      goods:getApp().globalData.courses[courseId],
    })
  },
  onLoad(options: { courseId?: string}){
    if (!options.courseId ){
      console.log("courseId is undefined")
      wx.navigateBack()
    }
    this.setData({
      courseId:options.courseId
    })

    console.log("order On load,course:",options.courseId)
    this.loadData()

  },
  // 新增复选框变更处理
  onTravelerChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      selectedTravelers: e.detail,
      totalPrice:e.detail.length*this.data.goods.price,
    })
    console.log("data?",this.data.selectedTravelers)
  },

  onGuardianChange(e: WechatMiniprogram.CustomEvent) {
    this.setData({
      selectedGuardians: e.detail
    })
  },
  // 添加出行人
  handleAddTraveler() {
    wx.navigateTo({
      url: '/pages/traveler/traveler'
    })
  },

  // 添加监护人
  handleAddGuardian() {
    wx.navigateTo({
      url: '/pages/selector/selector?type=guardian'
    })
  },
  // 提交订单处理
  handleSubmit() {
    if (this.data.selectedTravelers.length === 0) {
      wx.showToast({ title: '请选择出行人', icon: 'none' })
      return
    }

    const orderData = {
      courseId: this.data.courseId,
      travelers: this.data.selectedTravelers,
      totalPrice: this.data.totalPrice,
      token: getApp().globalData.token
    }
    
    // 实际应调用API提交数据
    wx.request<BindPhoneRet>({
      url: `${getApp().globalData.apiBase}/order/create`,
      method: 'POST',
      data: orderData,
      success: async (res) => {
        console.log('創建訂單:', res.data); // res.data为服务器响应内容
        let payRet = await wx.requestPayment({
          timeStamp:Math.floor(Date.now() / 1000).toString(),
          nonceStr:res.data.nonce_str,
          paySign:res.data.sign,
          package:res.data.prepay_id,
          signType:"MD5",
  
        })
        console.log("paymentret:",payRet)
      },
      fail: (err) => {
        console.error('请求失败:', err);
      },
    })

    console.log('提交订单数据:', orderData)
    wx.showToast({ title: '提交成功' })
  },
  // 删除人员
  handleDelete(e: any) {
    const { type, id } = e.currentTarget.dataset
    const key = type === 'traveler' ? 'travelers' : 'guardians'
    this.setData({
      [key]: this.data[key].filter((item: any) => item.id !== id)
    })
  }
})