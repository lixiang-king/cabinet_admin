<template>
  <view class="operation">
    <view class="item_list" @click="toEdit">
      <image src="../../static/img/manage/position_menu_01.png" mode="widthFix"></image>
      <text>编辑点位</text>
    </view>
    <view class="item_list" @click="toStock">
      <image src="../../static/img/manage/position_menu_02.png" mode="widthFix"></image>
      <text>进销存</text>
    </view>
    <view class="item_list" @click="toStatistic">
      <image src="../../static/img/manage/position_menu_03.png" mode="widthFix"></image>
      <text>数据统计</text>
    </view>
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    data () {
      return {
      }
    },
    computed: {
      ...mapState(['XPlaceId'])
    },
    methods: {
      toStock () { // 1.入库 2.出库
        uni.showActionSheet({
            itemList: ['库存详情', '入库记录', '出库记录'],
            success: res => {
              if (res.tapIndex === 0) {
                uni.navigateTo({
                  url: '/pages/position/detail'
                })
              } else {
                uni.navigateTo({
                  url: '/pages/position/record?type=' + res.tapIndex
                })
              }
            },
            fail: res => {
                console.log(res.errMsg);
            }
        })
      },
      toEdit () {
        uni.navigateTo({
          url: '/pages/position/positionEdit?id=' + this.XPlaceId
        })
      },
      toStatistic () {
        uni.navigateTo({
          url: '/pages/position/statistics'
        })
      }
    },
    onLoad() {
    }
  }
</script>

<style lang="less" scoped>
  .operation {
    padding: 15rpx;
    .item_list {
      background-color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-bottom: 20rpx;
      height: 220rpx;
      // box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;
      image {
        width: 100rpx;
        margin-bottom: 10rpx;
      }
    }
  }
</style>
