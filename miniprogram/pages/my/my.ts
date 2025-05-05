import {addTraveler}  from '../../utils/util'

Page({
  data: {
    phoneNumber: '', // 绑定手机号
    activeNames: [] as string[], // 折叠面板状态
    travelers: [] as Traveler[], // 出行人列表
    showForm:false,
    show:false,
    showDialog: false, // 弹窗状态
    isEdit: false, // 编辑模式
    currentTraveler: {} as Traveler, // 当前编辑对象
    showGenderPicker: false
  },
  onLoad() {
    console.log("my load",getApp().globalData)
    this.setData({
      phoneNumber:getApp().globalData.baseInfo.phone,
      travelers:getApp().globalData.baseInfo.travelers
    })
    //this.loadQrcode(options.id)
  },
  showPopup(){
    this.setData({ show: true });
  },
  // 绑定/修改手机号
  onGetPhoneNumber(e: WechatMiniprogram.GetPhoneNumber) {
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      // 调用后端解密接口
      console.log('加密数据:', e.detail)
      /*
      {errMsg: "getPhoneNumber:ok", encryptedData: "/7cr041mWJ5b2z8UO+rA9vA6iGJIk3xQ2Bq6BoKKyOsRJL6r27…bIOIcZ3JfWg6/RsiCQsENdPFU6avF28G0482nmsdAZ+rWqg==", iv: "GbegsUL64eA4dkS2w4gdaw==", code: "26176c84fad99bdb1a2e8e90d00475a1904702e14acef54861f86844255dcc0b"}
      */

      wx.request<BindPhoneRet>({
        url: `${getApp().globalData.apiBase}/user/bindphone`,
        method: 'POST',
        data: { "code":e.detail.code, "token": getApp().globalData.token },
        success: (res) => {
          console.log('请求成功:', res.data); // res.data为服务器响应内容
          this.setData({
            phoneNumber:res.data.phone
          })
        },
        fail: (err) => {
          console.error('请求失败:', err);
        },
      })
    }
  },
  handleSubmit(e: WechatMiniprogram.CustomEvent){
    const traveler = e.detail // 获取子组件传递的数据
    console.log('收到出行人数据:', traveler)
    console.log('global:',getApp().globalData.baseInfo)
    if( !getApp().globalData.baseInfo.travelers ){
      getApp().globalData.baseInfo.travelers = []
    }
    addTraveler( getApp().globalData.baseInfo.travelers, traveler)
    this.setData({showForm:false})
    //


  },
  // 折叠面板状态变化
  onCollapseChange(e: WechatMiniprogram.CollapseChange) {
    this.setData({
      activeNames: e.detail
    })
  },


  //展示
  showTravelerForm() {
    console.log("show traveler")
    this.selectComponent('#travelerForm')
    this.setData({
      showForm: true,
      currentTraveler: { idCard: '', name: '', age: '', gender: '' }
    })
  },
  // 添加出行人
  addTraveler() {
    this.setData({
      showDialog: true,
      isEdit: false,
      currentTraveler: {
        name: '',
        age: '',
        gender: '',
        class: '',
        idCard: '',
        relation: ''
      }
    })
  },

  // 编辑出行人
  editTraveler(e: WechatMiniprogram.TouchEvent) {
    const index = e.currentTarget.dataset.index
    this.setData({
      showDialog: true,
      isEdit: true,
      currentTraveler: { ...this.data.travelers[index] }
    })
  },

  // 提交出行人信息
  submitTraveler() {
    const { travelers, currentTraveler, isEdit } = this.data
    if (!currentTraveler.name || !currentTraveler.idCard) {
      wx.showToast({ title: '姓名和身份证必填', icon: 'none' })
      return
    }

    const newTravelers = [...travelers]
    if (isEdit) {
      const index = travelers.findIndex(t => t.idCard === currentTraveler.idCard)
      newTravelers[index] = currentTraveler
    } else {
      newTravelers.push(currentTraveler)
    }

    this.setData({
      travelers: newTravelers,
      showDialog: false
    })
  },

  // 关闭弹窗
  closeDialog() {
    this.setData({ showDialog: false })
  },

  // 性别选择
  showGenderPicker() {
    this.setData({ showGenderPicker: true })
  },
  hideGenderPicker() {
    this.setData({ showGenderPicker: false })
  },
  onGenderConfirm(e: WechatMiniprogram.PickerChange) {
    this.setData({
      'currentTraveler.gender': e.detail.value as string,
      showGenderPicker: false
    })
  }
})