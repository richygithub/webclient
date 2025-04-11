type VanField = {
  detail:  string | number ;
  currentTarget: {
    dataset: { field: string; index: number };
  };
};

Page({
  data: {
    courseId:"",
    amount:0,
    travelers: [{
      name: '',
      gender: '男',
      height: null,
      nation: '汉族',
      school: '',
      gradeClass: '',
      idCard: '',
      birthDate: ''
    }],
    nations: ['汉族', '蒙古族', '回族', '藏族', '维吾尔族', '其他'],
    genderOptions: ['男', '女']
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

  // 身份证输入处理
  handleIdCardInput(e: any) {
    const { index } = e.currentTarget.dataset
  
    const value = e.detail
    console.log("idcard",value)
    const travelers = this.data.travelers
    
    travelers[index].idCard = value
    this.setData({ travelers })
    
    // 自动计算出生日期
    if (value.length === 15 || value.length === 18) {
      travelers[index].birthDate = this.calculateBirthDate(value)
      this.setData({ travelers })
    }
  },

  // 计算出生日期
  calculateBirthDate(idCard: string): string {
    let birthStr = ''
    if (idCard.length === 15) {
      birthStr = '19' + idCard.substr(6, 6)
    } else if (idCard.length === 18) {
      birthStr = idCard.substr(6, 8)
    }
    
    return birthStr ? `${birthStr.substr(0,4)}-${birthStr.substr(4,2)}-${birthStr.substr(6,2)}` : ''
  },

  // 通用输入处理
  handleInput(e: VanField) {
    console.log("handle input",e.detail)
    const { field, index } = e.currentTarget.dataset
    const travelers = this.data.travelers
    console.log("field:",field,"index:",index)
    travelers[index][field] = e.detail
    console.log("---------",travelers)
    this.setData({ travelers })
  },

  // 民族选择
  handleNationChange(e: any) {
    const { index } = e.currentTarget.dataset
    const travelers = this.data.travelers
    travelers[index].nation = this.data.nations[e.detail.value]
    this.setData({ travelers })
  },

  // 性别选择
  handleGenderChange(e: any) {
    const { index } = e.currentTarget.dataset
    const travelers = this.data.travelers
    travelers[index].gender = e.detail.value
    this.setData({ travelers })
  },

  // 添加出行人
  addTraveler() {
    const newTraveler = {
      name: '',
      gender: '男',
      height: null,
      nation: '汉族',
      school: '',
      gradeClass: '',
      idCard: '',
      birthDate: ''
    }
    this.setData({
      travelers: [...this.data.travelers, newTraveler]
    })
  },

  // 提交表单
  submitForm() {
    console.log('提交数据：', this.data.travelers)
    const { courseId, amount, travelers } = this.data;
    wx.request<CourseInfo>({
      url: `${getApp().globalData.apiBase}/order/create`,
      method: 'POST',
      data: { courseId, amount, travelers, "token": getApp().globalData.token },
      success: (res) => {
        console.log('请求成功:', res.data); // res.data为服务器响应内容

        this.setData({

        })
      },
      fail: (err) => {
  
        console.error('请求失败:', err);
      },
    })



  }
})