// app.ts
App<IAppOption>({
  globalData: {
    apiBase:"https://127.0.0.1:443"
  },
  onLaunch(options) {

    if (options.query.scene) { // 处理扫码场景
      console.log("scan code.",options.query.scene)
      const scene = decodeURIComponent(options.query.scene)
      wx.navigateTo({
        url: `/pages/product-detail/product-detail?id=${scene}`
      })
    }

    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res.code)
        console.log("libl test")
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})