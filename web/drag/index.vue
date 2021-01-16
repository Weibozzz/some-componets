<template>
  <View class="drag-comp">
    <View
        class="wrapper"
        ref="voice"
    >
      <View class="limit-img">

      </View>
    </View>
  </View>
</template>
<script>
import {
  mapState,
  mapGetters
} from 'vuex'
export default {
  components: {},
  data () {
    return {
    }
  },
  computed: {
    ...mapState([]),
    ...mapState({}),
    ...mapGetters([])
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      const refVoice = this.$refs.voice
      const offsetWidth = refVoice.offsetWidth
      const screenWidth = document.body.clientWidth
      let maxW = screenWidth - offsetWidth
      let maxH = document.body.clientHeight - refVoice.offsetHeight
      let oL = 0
      let oT = 0
      refVoice.addEventListener('touchstart', (e) => {
        let ev = e || window.event
        let touch = ev.targetTouches[0]
        oL = touch.clientX - refVoice.offsetLeft
        oT = touch.clientY - refVoice.offsetTop
      })
      refVoice.addEventListener('touchmove', defaultEvent)
      refVoice.addEventListener('touchend', () => {
        // 吸附效果
        // if (refVoice.offsetLeft < 15) {
        //   refVoice.style.left = `-${offsetWidth / 2}px`
        // }
        // if (refVoice.offsetLeft > (screenWidth - offsetWidth - 15)) {
        //   refVoice.style.left = `${screenWidth - offsetWidth / 2}px`
        // }
        document.removeEventListener('touchmove', defaultEvent)
      })
      function defaultEvent (e) {
        e.preventDefault()
        let ev = e || window.event
        let touch = ev.targetTouches[0]
        let oLeft = touch.clientX - oL
        let oTop = touch.clientY - oT
        if (oLeft < 0) {
          oLeft = 0
        } else if (oLeft >= maxW) {
          oLeft = maxW
        }
        if (oTop < 0) {
          oTop = 0
        } else if (oTop >= maxH) {
          oTop = maxH
        }
        refVoice.style.left = oLeft + 'px'
        refVoice.style.top = oTop + 'px'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
