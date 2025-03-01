// components/countdown.ts
let _timer = 0 as number
Component({
  properties: {
    expireAt: { type: Number, value: 0 } // 修复类型定义
  },
 
  data: {
    timeLeft: '00:00'
  },
  observers: {
    'expireAt': function(expireAt) {
      this.updateTimer(expireAt)
    }
  },

  methods: {


    updateTimer(expireAt: number) {
      const update = () => {
        if (!expireAt) return
        
        const now = Date.now()
        if (now >= expireAt) {
          this.setData({ timeLeft: '已过期' })
          clearInterval(_timer)
          this.triggerEvent('expired')
          return
        }

        const seconds = Math.floor((expireAt - now) / 1000)
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
        const secs = (seconds % 60).toString().padStart(2, '0')
        this.setData({ timeLeft: `${mins}:${secs}` })
      }

      update()
      _timer = setInterval(update, 1000)
    }
  },

  detached() {
    clearInterval(_timer)
  }
})