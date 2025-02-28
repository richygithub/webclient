// pages/product-detail/product-detail.ts
Page({
  data: {
    campList: [] as Camp[]// 研学营列表
  },

  /**
   * 页面加载时触发
   */
  onLoad() {
    this.fetchCampList();
  },

  /**
   * 模拟从后端获取研学营列表数据
   */
  fetchCampList() {
    const campList = [
      {
        image: 'https://example.com/image1.jpg',
        title: '广州市铁一中学番禺校区高三11班 鼎湖山春季研学营',
        description: '问鼎征途 • 决战高考'
      },
      {
        image: 'https://example.com/image2.jpg',
        title: '广州市铁一中学番禺校区高三12班 鼎湖山春季研学营',
        description: '问鼎征途 • 决战高考'
      }
      // ... 更多研学营信息
    ];
    this.setData({ campList });
  },

  /**
   * 切换到其他页面
   */
  switchTab(e: any) {
    const page = e.currentTarget.dataset.page;
    let url = '';

    switch (page) {
      case 'home':
        url = '/pages/index/index';
        break;
      case 'square':
        url = '/pages/square/square';
        break;
      case 'trip':
        url = '/pages/trip/trip';
        break;
      case 'me':
        url = '/pages/me/me';
        break;
    }

    if (url) {
      wx.switchTab({ url });
    } else {
      wx.showToast({
        title: '页面不存在',
        icon: 'none'
      });
    }
  }
});