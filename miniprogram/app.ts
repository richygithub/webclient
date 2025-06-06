// app.ts
App<IAppOption>({
  globalData: {
    apiBase:"https://127.0.0.1/api",
    //apiBase:"https://libl.top/api",
    token:"",
    baseInfo:{
      phone:undefined,
      travelers:[]
    },
    courses:{

    }
  },
  onLaunch(options) {

    if(options.scene){
       console.log("scan code1.",options.scene)
    }
   console.log("launch path",options.path)
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
        if(res.code){
                // 将 code 发送到你的服务器
        wx.request<LoginResp>({
          url: `${getApp().globalData.apiBase}/login`,
          method: 'POST',
          data: { code: res.code },
          success(response) {
          const token = response.data.token;
          getApp().globalData.token = token;
          getApp().globalData.baseInfo = response.data.baseInfo
          console.log('用户token:', response.data);
        }
        });
        }
        console.log("libl test")
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      },
    })
  },
})