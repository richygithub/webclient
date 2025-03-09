// pages/product-detail/product-detail.ts

interface ApiResponse<T> {
  code: number
  message?: string
  data: T
}

interface CourseInfo {
  id: string
  title: string
  price: number
  cover: string
  desc: string
  images: string[]
  duration: string
  location: string
  features: string[]
}
interface CourseCode{
  data :ArrayBuffer
}
// 模拟数据生成器
const mockCourseData = (id: string): CourseInfo => ({
  id,
  title: '沉浸式自然探索课程',
  price: 298,
  desc: '这是一门专为青少年设计的户外探索课程，通过实地观察、动手实践和团队协作，帮助学员深入了解生态系统。课程包含森林徒步、动植物识别、野外生存技能等内容。',
  cover:'沉浸式自然探索课程',
  images: [
    'https://picsum.photos/750/500?random=1',
    'https://picsum.photos/750/500?random=2',
    'https://picsum.photos/750/500?random=3'
  ],
  duration: '2天1夜',
  location: '杭州西溪国家湿地公园',
  features: [
    '专业自然导师带队',
    '安全保险全程覆盖',
    '提供全套探索装备',
    '小班制教学（6-8人）',
    '颁发课程结业证书'
  ]
})

Page({
  data: {
    course: {} as CourseInfo,
    loading: true,
    error: false
  },

  onLoad(options: { id: string }) {
    this.loadCourseDetail(options.id)
    this.loadQrcode(options.id)
  },

  async loadCourseDetail(id: string) {


    wx.request<CourseInfo>({
      url: `${getApp().globalData.apiBase}/courses/${id}`,
      method: 'GET',
      success: (res) => {
        console.log('请求成功:', res.data); // res.data为服务器响应内容

        this.setData({
          course: res.data,
          loading: false
        })
      },
      fail: (err) => {
        this.handleError()
        console.error('请求失败:', err);
      },
    })

  },
  // 获取二维码
  async loadQrcode(courseId: string) {
    wx.showLoading({ title: '生成二维码中' })
  
    try {
       wx.request<ArrayBuffer>({
        url: `${getApp().globalData.apiBase}/courses/${courseId}/qrcode`,
        responseType: 'arraybuffer',
        method: 'GET',
        success: (res) => {
          console.log('请求成功:', res.data); // res.data为服务器响应内容
          const base64 = wx.arrayBufferToBase64(res.data)
          this.setData({
            qrcodeUrl: 'data:image/png;base64,' + base64
          })
        },
      })

      // const res = awaitwx.request({
      //   url: `${getApp().globalData.apiBase}/courses/${courseId}/qrcode`,
      //   responseType: 'arraybuffer'
      // })
      
      // const base64 = wx.arrayBufferToBase64(res.data)
      // this.setData({
      //   qrcodeUrl: 'data:image/png;base64,' + base64
      // })
    } catch (err) {
      wx.showToast({ title: '二维码加载失败', icon: 'none' })
    }
    
    wx.hideLoading()
  },

  handleError() {
    this.setData({ loading: false, error: true })
    wx.showToast({ title: '数据加载失败', icon: 'none' })
  },

  handleBuy() {
    const { id, price } = this.data.course
    wx.navigateTo({
      url: `/pages/payment/payment?courseId=${id}&amount=${price}`
    })
  },

  onShareAppMessage() {
    return {
      title: `${this.data.course.title} | 推荐课程`,
      path: `/pages/product-detail/product-detail?id=${this.data.course.id}`
    }
  }
})