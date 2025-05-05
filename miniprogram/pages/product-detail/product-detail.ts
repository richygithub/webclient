// pages/product-detail/product-detail.ts



Page({
  data: {
    course: {} as CourseInfo,
    loading: true,
    error: false
  },

  onLoad(options: { id: string }) {
    this.loadCourseDetail(options.id)
    //this.loadQrcode(options.id)
  },

  async loadCourseDetail(id: string) {


    wx.request<CourseInfo>({
      url: `${getApp().globalData.apiBase}/courses/${id}`,
      header: {
        'ngrok-skip-browser-warning': 'true' // 关键头信息
      },
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
    // 将 ArrayBuffer 转换为临时图片路径
    convertArrayBufferToImagePath(buffer: ArrayBuffer): Promise<string> {
      const fs = wx.getFileSystemManager();
      const filePath = `${wx.env.USER_DATA_PATH}/qrcode_${Date.now()}.png`;
      console.log(`tmp filepath:${filePath}, udata:${wx.env.USER_DATA_PATH}`)
      return new Promise((resolve, reject) => {
        fs.writeFile({
          filePath,
          data: buffer,
          encoding: "binary",
          success: () => resolve(filePath),
          fail: reject,
        });
      });
    },

    async handleResponse(data: ArrayBuffer) {
      try {
        const qrCodeSrc = await this.convertArrayBufferToImagePath(data);
        console.log(`set data path:${qrCodeSrc}`)
        this.setData({
          qrcodeUrl:qrCodeSrc
        })
      } catch (error) {
        console.error('处理二维码失败:', error);
        wx.showToast({ title: '二维码生成失败', icon: 'none' });
      }
    },
  // 获取二维码
  async loadQrcode(courseId: string) {
    wx.showLoading({ title: '生成二维码中' })
  
    try {
       wx.request<ArrayBuffer>({
        url: `${getApp().globalData.apiBase}/courses/${courseId}/qrcode`,
        header: {
          'ngrok-skip-browser-warning': 'true' // 关键头信息
        },
        responseType: 'arraybuffer',
        method: 'GET',
        success: (res) => {
          console.log('请求成功:', res.data); // res.data为服务器响应内容
          this.handleResponse(res.data)
          //const base64 = wx.arrayBufferToBase64(res.data)
  

 
          // this.setData({
          //   qrcodeUrl: 'data:image/png;base64,' + base64
          // })
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
    console.log("course info:",this.data.course)
    console.log(`navigate ${id}, ${price}`)
    wx.navigateTo({
      //url: `/pages/payment/payment?courseId=${id}&amount=${price}`
      url: `/pages/order/order?courseId=${id}&amount=${price}`
      //url: `/pages/traveler/traveler`

    })
  },

  onShareAppMessage() {
    return {
      title: `${this.data.course.title} | 推荐课程`,
      path: `/pages/product-detail/product-detail?id=${this.data.course.id}`
    }
  }
})