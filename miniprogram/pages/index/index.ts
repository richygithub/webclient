// pages/index/index.ts
Page({
  data: {
    currentTab: 'home',
    tabs: [
      { key: 'home', text: '首页', icon: '/images/home.png', activeIcon: '/images/home-active.png' },
      { key: 'schedule', text: '行程', icon: '/images/schedule.png', activeIcon: '/images/schedule-active.png' },
      { key: 'cart', text: '购物车', icon: '/images/cart.png', activeIcon: '/images/cart-active.png' },
      { key: 'me', text: '我', icon: '/images/me.png', activeIcon: '/images/me-active.png' }
    ],
    courses: [] as Course[],
    orders: [] as Order[], 
    cartBadge: false
  },

  onLoad() {
    this.loadCourses()
    this.checkOrders()
  },

  async loadCourses() {
    try{

      // const res = await wx.request<ApiResponse<Course[]>>({
      //   url: `${getApp().globalData.apiBase}/courses/`,
      //   method: 'GET'
      // })
      
      wx.request<Course[]>({
            url: `${getApp().globalData.apiBase}/courses/`,
            header: {
              'ngrok-skip-browser-warning': 'true' // 关键头信息
            },
          method: 'GET',
          success: (res) => {
            console.log('请求成功:', res.data); // res.data为服务器响应内容

            this.setData({
              courses:res.data
            })
          },
          fail: (err) => {
            console.error('请求失败:', err);
          },
      })

    }catch(err){
      console.log("load err:",err)
    }

    // // 模拟数据
    // this.setData({
    //   courses: Array(5).fill(0).map((_,i) => ({
    //     id: i.toString(),
    //     title: `自然探索课程 ${i+1}`,
    //     price: 298 + i * 100,
    //     cover: `https://picsum.photos/750/500?nature${i}`
    //   }))
    // })
  },

  checkOrders() {
    // 模拟未支付订单
    this.setData({ 
      cartBadge: true,
      orders: [{
        _id: 'mock_order',
        expireAt: Date.now() + 30 * 60 * 1000,
        course: { title: '模拟课程' }
      }]
    })
  },

  switchTab(e: WechatMiniprogram.TouchEvent) {
    const tab = e.currentTarget.dataset.key
    this.setData({ currentTab: tab })
    
    // 其他tab的数据加载逻辑
    if (tab === 'schedule') this.loadSchedule()
    if (tab === 'me') this.loadProfile()
  },
  // 添加缺失的方法
  loadSchedule() {
    // 行程页面数据加载逻辑
    console.log('加载行程数据')
  },

  loadProfile() {
    // 个人中心数据加载逻辑
    console.log('加载个人资料')
  },
  navigateToDetail(e: WechatMiniprogram.TouchEvent) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/product-detail/product-detail?id=${id}`
    })
  }
})

