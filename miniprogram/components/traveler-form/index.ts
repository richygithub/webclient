Component({
  properties: {
    show: Boolean,
    traveler: Object
  },

  data: {
    localTraveler: {} as Traveler,
    dataValid: false
  },

  observers: {
    'traveler': function(newVal) {
      this.setData({ localTraveler: { ...newVal } })
    }
  },

  methods: {
    onChangeName(e: WechatMiniprogram.CustomEvent) {
      this.setData({ 'localTraveler.name': e.detail })
    },

    onChangeIdCard(e: WechatMiniprogram.CustomEvent) {
      
      console.log("ID Change",e.detail);
      this.validateIdCard(e.detail )
      this.setData({ 'localTraveler.idCard': e.detail })
    },

    onChangeAge(e: WechatMiniprogram.CustomEvent) {
      this.setData({ 'localTraveler.age': e.detail })
    },

    showGenderPicker() {
      this.setData({ showGenderPicker: true })
    },

    hideGenderPicker() {
      this.setData({ showGenderPicker: false })
    },

    onGenderConfirm(e: WechatMiniprogram.CustomEvent) {
      this.setData({
        'localTraveler.gender': e.detail.value,
        showGenderPicker: false
      })
    },

    handleSubmit() {
      if (!this.data.localTraveler.name ) {
        wx.showToast({ title: '姓名和身份证必填', icon: 'none' })
        return
      }
      if ( !this.data.dataValid) {
        wx.showToast({ title: '身份证无效', icon: 'none' })
        return
      }

      this.triggerEvent('submit', this.data.localTraveler)
      this.setData({ showGenderPicker: false })
    },

    handleClose() {
      this.triggerEvent('close')
    },
        // 身份证校验逻辑
        validateIdCard(id: string):boolean {
          if (!id) return false
          if (id.length !== 18){
            this.setData({ errorMessage:'身份证号码长度不正确'})
            return false
          }
          if (!/^\d{17}[\dX]$/.test(id)){
            this.setData({ errorMessage:'包含非法字符'})
            return false
          } 
    
          // 校验码验证
          // const checkCode = this.calculateCheckCode(id)
          // if (checkCode !== id[17]) {
          //   this.setData({ errorMessage:'校验码错误'})
          //   return
          // }
    
          // 日期验证
          
          if (!this.getBirthdayFromIdCard(id)) {
            this.setData({ errorMessage:'无效的出生日期'})
            return false
          }
          this.setData({ errorMessage:'', dataValid:true})

          return true
  
        },
            // 计算校验码
    calculateCheckCode(id: string): string {
      const weights = [7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2]
      const checkCodes = ['1','0','X','9','8','7','6','5','4','3','2']
      
      let sum = 0
      for(let i=0; i<17; i++){
        sum += parseInt(id[i]) * weights[i]
      }
      return checkCodes[sum % 11]
    },
    getBirthdayFromIdCard(id:string):boolean{
      const dateStr = id.substr(6,8)
      const year = parseInt(dateStr.substr(0,4))
      const month = parseInt(dateStr.substr(4,2)) - 1
      const day = parseInt(dateStr.substr(6,2))
      
      if(month < 0 || month > 11) return false
      
      //生日
      const birthDate = new Date(year, month, day)
      if( birthDate.getFullYear() != year || 
        birthDate.getMonth() != month || 
        birthDate.getDate() != day )
             return false

            // 年龄计算
            const today = new Date()
            let age = today.getFullYear() - birthDate.getFullYear()
            if (today.getMonth() < birthDate.getMonth() || 
               (today.getMonth() === birthDate.getMonth() && 
                today.getDate() < birthDate.getDate())) {
              age--
            }
                  // 性别计算（第17位奇偶判断）
            const gender = parseInt(id[16]) % 2 === 1 ? '男' : '女'
            console.log(birthDate,age,gender)
            this.setData({
              'localTraveler.birthDate': `${year}-${month}-${day}`,
              'localTraveler.age': age,
              'localTraveler.gender': gender
            })

            return true
    }
  }
})