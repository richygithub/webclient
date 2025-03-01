// components/identity-modal.ts
Component({
  properties: {
    show: { type: Boolean, value: false }
  },

  data: {
    form: {
      name: '',
      idCard: '',
      phone: '',
      nickname: ''
    }
  },

  methods: {
    onNameInput(e: WechatMiniprogram.Input) {
      this.setData({ 'form.name': e.detail.value })
    },

    onIdCardInput(e: WechatMiniprogram.Input) {
      this.setData({ 'form.idCard': e.detail.value })
    },

    onPhoneInput(e: WechatMiniprogram.Input) {
      this.setData({ 'form.phone': e.detail.value })
    },

    onNicknameInput(e: WechatMiniprogram.Input) {
      this.setData({ 'form.nickname': e.detail.value })
    },

    onCancel() {
      this.triggerEvent('cancel')
    },

    onSubmit() {
      const { name, idCard, phone } = this.data.form
      if (!name || !idCard || !phone) {
        wx.showToast({ title: '请填写必填项', icon: 'none' })
        return
      }

      if (!/^\d{17}[\dX]$/.test(idCard)) {
        wx.showToast({ title: '身份证格式错误', icon: 'none' })
        return
      }

      if (!/^1[3-9]\d{9}$/.test(phone)) {
        wx.showToast({ title: '手机号格式错误', icon: 'none' })
        return
      }

      this.triggerEvent('submit', this.data.form)
    }
  }
})