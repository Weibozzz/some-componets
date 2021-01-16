<template>
  <View class="drag-comp">
    <View
        class="wrapper"
        id="drag-image"
        @touchstart="touchstart"
        @touchmove="touchmove"
        @touchend="touchend"
        :style="{
          left: oLeft + 'px',
          top: oTop + 'px',
        }"
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
      windowWidth: 0, // 屏幕宽度
      windowHeight: 0,
      maxW: 0, // 最大移动的距离
      maxH: 0,
      left: 0, // 刚触摸，触摸点和左边的距离
      top: 0,
      oL: 0, // 刚触摸，滑块距离左边的距离
      oT: 0,
      oTop: 20, // 最终计算的偏移距离
      oLeft: 100,
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
    touchstart (e) {
      const { pageX, pageY } = e.touches[0] || {}
      this.oL = pageX
      this.oT = pageY
      const query = uni.createSelectorQuery()
          .in(this)
      query.select('#drag-image')
          .boundingClientRect(data => {
            const { left, top } = data
            this.left = left
            this.top = top
          })
          .exec()
    },
    touchend (e) {
    },
    touchmove (e) {
      e.preventDefault()
      const { pageX, pageY } = e.touches[0] || {}
      let oLeft = pageX - this.oL + this.left
      let oTop = pageY - this.oT + this.top
      if (oLeft < 0) {
        oLeft = 0
      } else if (oLeft >= this.maxW) {
        oLeft = this.maxW
      }
      if (oTop < 0) {
        oTop = 0
      } else if (oTop >= this.maxH) {
        oTop = this.maxH
      }
      this.oLeft = oLeft
      this.oTop = oTop
    },
    init () {
      const { windowHeight, windowWidth } = uni.getSystemInfoSync()
      this.windowHeight = windowHeight
      this.windowWidth = windowWidth
      const query = uni.createSelectorQuery()
          .in(this)
      query.select('#drag-image')
          .boundingClientRect(data => {
            const { width, height } = data
            this.maxW = windowWidth - width
            this.maxH = windowHeight - height
          })
          .exec()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
</style>
