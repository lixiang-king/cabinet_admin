<template>
  <view class="operation">
    <view class="item_list" @click="toDetail">
      <image src="../../static/img/manage/stock_menu_01.png" mode="widthFix"></image>
      <text>库存详情</text>
    </view>
    <view class="item_list" @click="toRecord(2)">
      <image src="../../static/img/manage/stock_menu_02.png" mode="widthFix"></image>
      <text>出库记录</text>
    </view>
    <view class="item_list" @click="toRecord(1)">
      <image src="../../static/img/manage/stock_menu_03.png" mode="widthFix"></image>
      <text>入库记录</text>
    </view>
  </view>
</template>

<script>
  export default {
    data () {
      return {
        
      }
    },
    methods: {
      toRecord (type) { // 1.入库 2.出库
        uni.navigateTo({
          url: '/pages/stock/record?type=' + type
        })
      },
      toDetail () {
        uni.navigateTo({
          url: '/pages/stock/detail'
        })
      }
    },
    onLoad() {
      // uni.setNavigationBarTitle({
      //   title: '奥斯卡KTV'
      // })
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
        width: 130rpx;
      }
    }
  }
</style>
