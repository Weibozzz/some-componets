<template>
  <View class="food-list">
    <u-tabs
        :list="showQuickTabs"
        :is-scroll="true"
        active-color="#2283E2"
        :current="current"
        @change="handleChange" />
    <scroll-view
        scroll-with-animation
        id="scroll-view"
        :scroll-into-view="intoView"
        scroll-y
        @scrolltolower="handlerScrolltolower"
        @scroll="handleScroll">
      <View id="scroll-wrapper">
        <View
            class="cate-items"
            v-for="(item) in foodCateList"
            :key='item.key'
            :id="'item-' + item.key"
        >
          <View v-if="item.list.length" class="cate-item">
            <View class="title">{{ item.name }}</View>
            <View class="cate-item-list">
              <View
                  class="cate-list-item"
                  v-for="(food,index) in item.list"
                  :key='index'
                  @click='handleItem(food,index)'
              >
                <View class='item-content'>
                  <View
                      class='img'
                      :style="{
                    backgroundImage: `url(${food.picUrl})`
                  }"
                  >
                  </View>
                  <View class='title'>{{ food.foodName }}</View>
                  <View
                      class='remark'
                      :class='{
                  expired: food.status === 1,
                  soon: food.status === 2,
                  fresh: food.status === 0,
                }'
                  >
                    {{ getFoodTipText(food) }}
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </scroll-view>
  </View>
</template>
<script>
import Menubar from '../menubar/index'
const foodList = [...new Array(30)]
    .map((item, index) => {
      return {
        'foodName': '黄瓜',
        'status': parseInt(Math.random() * 2),
        'date': parseInt(Math.random() * 400),
        'unit': 'day',
        'picUrl': 'https://api.unilifemedia.com/pic/publicFood/huanggua.png',
        'recordId': index
      }
    })
export default {
  components: {
    Menubar
  },
  data () {
    return {
      isShowClose: false,
      isClick: false,
      intoView: 'oneWeek',
      current: 0,
      initDomInfo: [],
      showQuickTabs: [
        {
          key: 'oneWeek',
          name: '一周内',
          days: '7',
          list: []
        },
        {
          key: 'oneMounth',
          name: '一个月内',
          days: '30',
          list: []
        },
        {
          key: 'halfYears',
          name: '半年内',
          days: '180',
          list: []
        },
        {
          key: 'oneYears',
          name: '一年内',
          days: '365',
          list: []
        },
        {
          key: 'more',
          name: '更多',
          days: '',
          list: []
        }
      ],
      foodList
    }
  },
  computed: {
    foodCateList () {
      const showQuickTabs = this.showQuickTabs
      const list = this.foodList
      showQuickTabs.forEach(v => {
        v.list = []
      })
      list.forEach((item) => {
        const { status, date, unit } = item
        if (status === 1 || unit === 'hour') {
          // 过期 显示在一周内
          showQuickTabs[0].list.push(item)
        }
        if ((status === 0 || status === 2) && unit !== 'hour') {
          // 新鲜 临期
          if (date <= 7) {
            showQuickTabs[0].list.push(item)
            return
          }
          if (date <= 30) {
            showQuickTabs[1].list.push(item)
            return
          }
          if (date <= 180) {
            showQuickTabs[2].list.push(item)
            return
          }
          if (date <= 365) {
            showQuickTabs[3].list.push(item)
            return
          }
          showQuickTabs[4].list.push(item)
        }
      })
      return showQuickTabs
    }
  },
  watch: {
    foodList: {
      handler (val) {
        if (val.length) {
          this.$nextTick(() => {
            this.showQuickTabs.forEach(item => {
              const query = uni.createSelectorQuery()
                  .in(this)
              query.select(`#item-${item.key}`)
                  .boundingClientRect(data => {
                    const isExist = this.initDomInfo.find(v => v.id === data.id)
                    const total = this.initDomInfo.reduce((total, item) => {
                      total += item.height
                      return total
                    }, 0)
                    if (!isExist) {
                      this.initDomInfo.push({
                        id: data.id,
                        height: data.height,
                        totalHeight: data.height + total
                      })
                    }
                  })
                  .exec()
            })
          })
        }
      },
      immediate: true
    }
  },
  mounted () {
  },
  methods: {
    handleChange (index) {
      const item = this.showQuickTabs[index]
      this.isClick = true
      this.intoView = `item-${item.key}`
      this.current = index
    },
    // 滚动到底部
    handlerScrolltolower () {
    },
    handleScroll (e) {
      const { scrollTop } = e.detail
      this.setScrollCurrent(scrollTop)
    },
    setScrollCurrent (scrollTop) {
      const index = this.initDomInfo.findIndex(v => v.totalHeight > scrollTop)
      if (index === -1) {
        return
      }
      setTimeout(() => {
        this.isClick = false
      }, 0)
      if (this.isClick) return
      this.current = index
    },
    handleSetting () {
      this.isShowClose = true
    },
    handleCancel () {
    },
    handleConfirm () {
      this.isShowClose = false
    },
    handleItem (item, index) {
      if (this.isShowClose) return
      this.$emit('handleItem', item, index)
    },
    handleDel (item, index) {
      this.$emit('handleDel', item, index)
    },
    getFoodTipText ({ status, date, unit }) {
      if (unit === 'hour') {
        return '1天内过期'
      }
      if (status === 1) {
        return `已过期${date}天`
      }
      return `${date}天后过期`
    }
  }
}
</script>

<style lang="scss" scoped>

.food-list{
  position: relative;
}
scroll-view{
  height: 60vh;
}
.cate-items{
  padding: 0 24rpx;
  &:first-child{
    padding-top: 12rpx;
  }
  .title{
    padding-top: 18rpx;
    padding-bottom: 16rpx;
    font-size: 24rpx;
    color: #999999;
  }
}
.cate-item-list{
  display: flex;
  flex-wrap: wrap;
}
.cate-list-item{
  text-align: center;
  width: 33.3333%;
  box-sizing: border-box;
  &:not(:nth-of-type(3n)){
    padding-right: 14rpx;
  }
  .item-content{
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    padding: 20rpx 0 32rpx 0;
    margin-bottom: 16rpx;
    background: #FFFFFF;
    border-radius: 16rpx;
    &.hide{
      opacity: 0;
    }
    .close{
      position: absolute;
      top: 8rpx;
      right: 8rpx;
      width: 48rpx;
      height: 48rpx;
    }
  }
  .img{
    display: flex;
    width: 104rpx;
    height: 104rpx;
    margin-left: 24rpx;
    margin-right: 12rpx;
    background-size: cover;
  }
  .title{
    margin-bottom: 4rpx;
    margin-top: 8rpx;
    font-size: 32rpx;
    color: #333333;
    width: 170rpx;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .remark{
    font-size: 26rpx;
    color: #999999;
    width: 170rpx;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    &.expired{
      color: #ED2856;
    }
    &.soon {
      color: #F5A623;
    }
    &.fresh {
      color: #44BE3C;
    }
  }
}

</style>
