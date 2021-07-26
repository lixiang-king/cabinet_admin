<template>
  <view class="">
    <view class="search_block">
      <view class="search_input">
        <image src="../../static/img/public/search.png" mode="widthFix"></image>
        <input type="text" confirm-type="search" :value="goodsName" placeholder="请输入商品名称" @input="onSearchInput" />
      </view>
      <text class="search" @click="getStockInfo">搜索</text>
    </view>
    <view class="page_title">
      <view class="p_title" style="fontSize: 30rpx;">库存总计</view>
    </view>
    <view class="total_line">
      <view class="line_item">
        <view class="txt_info">
          <view>库存总类</view>
          <view><text>{{ stock_category }}</text>种</view>
        </view>
        <image src="../../static/img/manage/stock_total_01.png" mode="widthFix"></image>
      </view>
      <view class="line_item">
        <view class="txt_info">
          <view>库存总量</view>
          <view><text>{{ stock_sum }}</text>件</view>
        </view>
        <image src="../../static/img/manage/stock_total_02.png" mode="widthFix"></image>
      </view>
    </view>
    <view class="list_box">
      <view class="list_item" v-for="item in dataList" :key="item.goods_id" @click="toOperation(item)">
        <view class="item_label">
          <image :src="item.small_img" mode="widthFix"></image>
          <view class="">{{ item.goods_name }}</view>
        </view>
        <view class="item_value">
          剩余：<text>{{ item.stock_num }}根</text>
        </view>
      </view>
    </view>
    <view class="bottom_btn" @click="toAdd">
    	添加商品
    </view>
  </view>
</template>

<script>
  import { httpStockInfo } from '@/utils/request/api/stock.js'
  import { mapState } from 'vuex'
  export default {
    computed: {
      ...mapState(['XChannelId'])
    },
    data() {
      return {
        goodsName: '',
        stock_category: 0,
        stock_sum: 0,
        dataList: []
      }
    },
    methods: {
      onSearchInput(e) {
        this.goodsName = e.target.value
      },
      toAdd () {
        uni.navigateTo({
          url: '/pages/stock/goods'
        })
      },
      toOperation (item) {
        uni.showActionSheet({
            itemList: ['入库', '出库'],
            success: function (res) {
                uni.navigateTo({
                  url: '/pages/stock/putsetting?type=' + ( res.tapIndex + 1) + '&goodsId=' + item.goods_id
                })
            },
            fail: function (res) {
                console.log(res.errMsg);
            }
        })
      },
      async getStockInfo () {
        const params = {
          channel_id: this.XChannelId,
          goods_name: this.goodsName
        }
        const { msg } = await httpStockInfo(params)
        this.dataList = msg.stock_info
        this.stock_category = msg.stock_category
        this.stock_sum = msg.stock_sum
      }
    },
    onShow() {
      this.getStockInfo()
    }
  }
</script>

<style lang="less" scoped>
  .search_block {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #FFFFFF;
    padding: 16rpx 20rpx;

    .search_input {
      position: relative;
      display: flex;
      justify-content: enter;
      align-items: center;

      image {
        width: 25rpx;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 15rpx;
      }

      input {
        width: 600rpx;
        height: 50rpx;
        background-color: #EBEBEB;
        border-radius: 10rpx;
        font-size: 24rpx;
        padding-left: 50rpx;
      }
    }

    .search {
      font-size: 28rpx;
      width: 57rpx;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
    }
  }
  .page_title {
    margin-top: 10rpx;
    height: 60rpx;
    line-height: 60rpx;
    background-color: #FFFFFF;
    padding: 20rpx;
  }
  .total_line {
    padding-bottom: 20rpx;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    color: #FFFFFF;
    background-color: #FFFFFF;

    .line_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8rpx;
      width: 362rpx;
      height: 146rpx;
      border-radius: 5rpx;
      padding: 0 27rpx;
      box-sizing: border-box;
      background-color: #FFFFFF;
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;
      background: url(../../static/img/manage/stock_total_bg.png) no-repeat;
      background-size: contain;

      &:nth-of-type(1) {
        margin-right: 8rpx;
      }

      .txt_info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;

        view {
          font-size: 22rpx;
          opacity: 0.85;
          &:nth-of-type(2) {
            // opacity: 0.85;
            text {
              font-size: 40rpx;
              opacity: 1;
              margin-right: 10rpx;
            }
          }
          
        }
      }

      image {
        width: 76rpx;
        margin-left: 24rpx;
      }
    }
  }
  .list_box {
    margin: 10rpx;
    background-color: #FFFFFF;
    .list_item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1rpx solid #dddddd;
      color: #333333;
      height: 108rpx;
      padding: 0 20rpx;
      .item_label {
        display: flex;
        align-items: center;
        image {
          width: 82rpx;
          height: 82rpx;
          margin-right: 18rpx;
        }
      }
      .item_value {
        text {
          color: #FF5449;
        }
      }
    }
  }
</style>
