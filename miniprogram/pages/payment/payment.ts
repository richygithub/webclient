// 定义数据类型
interface CourseData {
  id: string;
  price: number;
}

interface OrderParams {
  courseId: string;
  amount: number;
  name: string;
  idCard: string;
}

interface PaymentParams {
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}

Page<{
  courseId: string;
  amount: number;
  name: string;
  idCard: string;
  loading: boolean;
}, any>({
  data: {
    courseId: '',
    amount: 0,
    name: '',
    idCard: '',
    loading: false
  },

  // 初始化获取参数
  onLoad(options: { courseId?: string; amount?: string }) {
    if (!options.courseId || !options.amount) {
      wx.showToast({ title: '参数错误', icon: 'none' });
      wx.navigateBack();
      return;
    }

    console.log(`[debug] payment load ${options.courseId},${options.amount}`)
    this.setData({
      courseId: options.courseId,
      amount: parseFloat(options.amount)
    });
  },

  // 输入处理
  handleInput(e: WechatMiniprogram.Input) {
    const field = e.currentTarget.dataset.field as keyof OrderParams;
    const value = e.detail.value;
    this.setData({ [field]: value });
  },

  // 提交订单
  async handleSubmit() {
    if (this.data.loading) return;

    // 表单验证
    if (!this.validateForm()) return;

    this.setData({ loading: true });

    try {
      // 创建订单
      const orderRes = await this.createOrder();

      // 调用支付
      const payParams = await this.getPaymentParams(orderRes.orderNo);
      await this.invokePayment(payParams, orderRes.orderNo);

    } catch (error) {
      const errMsg = (error as Error).message || '支付失败';
      wx.showToast({ title: errMsg, icon: 'none' });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 表单验证
  validateForm(): boolean {
    const { name, idCard } = this.data;
    const idCardRegex = /^\d{17}[\dXx]$/;

    if (!name || !idCard) {
      wx.showToast({ title: '请填写完整信息', icon: 'none' });
      return false;
    }

    if (!idCardRegex.test(idCard)) {
      wx.showToast({ title: '身份证格式错误', icon: 'none' });
      return false;
    }

    return true;
  },

  // 创建订单
  async createOrder(): Promise<{ orderNo: string }> {
    const { courseId, amount, name, idCard } = this.data;
    const res = await wx.request<{ code: number; data: { orderNo: string }; msg?: string }>({
      url: `${getApp().globalData.apiBase}/order/create`,
      method: 'POST',
      data: { courseId, amount, name, idCard, "token": getApp().globalData.token }
    });
    console.log(`create Order `,res)

    if (res.data.code !== 200) {
      throw new Error(res.data.msg || '创建订单失败');
    }

    return { orderNo: res.data.data.orderNo };
  },

  // 获取支付参数
  async getPaymentParams(orderNo: string): Promise<PaymentParams> {
    const res = await wx.request<{ data: PaymentParams }>({
      url: 'https://your-api.com/payment/unified',
      method: 'POST',
      data: { orderNo }
    });
    return res.data.data;
  },

  // 调起支付
  async invokePayment(payParams: PaymentParams, orderNo: string) {
    const res = await wx.requestPayment(payParams);
    if (res.errMsg !== 'requestPayment:ok') throw new Error('支付取消');

    // 确认支付
    await wx.request({
      url: 'https://your-api.com/payment/confirm',
      method: 'POST',
      data: { orderNo }
    });

    wx.redirectTo({ url: `/pages/order/success?orderNo=${orderNo}` });
  }
});