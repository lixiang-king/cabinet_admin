<template>
  <view class="goods_page">
    <view class="search_block">
      <view class="search_input">
        <image src="../../static/img/public/search.png" mode="widthFix"></image>
        <input type="text" confirm-type="search" v-model="searchName" placeholder="请输入用户名" />
      </view>
      <text class="search" @click="toSearch">搜索</text>
    </view>
    <view class="goods_list">
      <view class="list_item" v-for="item in dataList" :key="item.goods_id">
        <image :src="item.small_img" mode="widthFix"></image>
        <view class="goods_info">
          <view>{{ item.goods_name }}</view>
          <view>商品售价（元）：<text>{{ item.goods_price | f_null_zero }}</text></view>
          <view>商品成本价（元）：{{ item.cost_price | f_null_zero }}</view>
        </view>
        <view class="btn" @click="onSelect(item)">选择</view>
      </view>
    </view>
  </view>
</template>

<script>
import { httpProGoods } from '@/utils/request/api/programme.js'
export default {
  props: {
    dataList: {
      type: Array,
      default () {
        return []
      }
    },
  },
  filters: {
    f_null_zero: function(value) {
      return value ? value : 0
    }
  },
  data () {
    return {
      searchName: ''
    }
  },
  methods: {
    onSearchInput (e) {
      this.goodsName = e.target.value
    },
    toSearch () {
      console.log(this.goodsName)
    },
    onSelect (item) {
      this.$emit('ok', item, JSON.stringify(item.small_img))
    }
  }
}
</script>

<style lang="less" scoped>
.search_block {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
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
      background-color: #ebebeb;
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
.goods_list {
  padding: 15rpx;
  .list_item {
    display: flex;
    align-items: center;
    padding: 30rpx;
    margin-bottom: 15rpx;
    background-color: #ffffff;
    image {
      width: 124rpx;
      height: 124rpx;
      margin-right: 20rpx;
    }
    .goods_info {
      width: 420rpx;
      font-size: 24rpx;
      view {
        &:nth-of-type(1) {
          font-weight: bold;
          font-size: 30rpx;
        }
        text {
          color: #e44a58;
        }
      }
    }
    .btn {
      width: 87rpx;
      height: 87rpx;
      line-height: 87rpx;
      text-align: center;
      border-radius: 50%;
      background-color: #ff8e36;
      color: #ffffff;
    }
  }
}
</style>
