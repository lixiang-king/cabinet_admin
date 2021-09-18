<template>
  <view>
    <SearchHeader placeholder="点位名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
    <view class="device_list" v-if="dataList.length">
      <view class="device_item" v-for="item in dataList" :key="item.place_id" @click="toDetail(item.place_id)">
        <view class="txt_info">
          <text>{{ item.place }}</text>
          <text>设备总数: {{ item.qh_machine_num }}台</text>
        </view>
        <image src="../static/img/manage/manage_buildings.png" mode="widthFix"></image>
      </view>
    </view>
    <view class="c_empty_box" v-else>
      <image src="../static/img/public/empty.png" mode="widthFix"></image>
      暂无内容
    </view>
  </view>
</template>

<script>
  import {
    httpOpReplenishList
  } from '@/utils/request/api/operation.js'
  export default {
    data() {
      return {
        dataList: [],
        region: [],
        searchName: ''
      };
    },
    methods: {
      onSelectRegion(region) {
        this.region = region
        this.getDataList()
      },
      onSearch(value) {
        this.searchName = value
        this.getDataList()
      },
      toDetail(id) {
        uni.navigateTo({
          url: '/operation/supplyAddDetail?id=' + id
        })
      },
      async getDataList() {
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : ''
        }
        const { msg } = await httpOpReplenishList(params)
        this.dataList = msg.bh_manage
      }
    },
    onLoad() {
      this.getDataList()
    }
  }
</script>

<style lang="less">
  .device_total {
    position: relative;
    width: 100%;
    height: 100rpx;
    // line-height: 100rpx;
    margin: 8rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(../static/img/manage/device_total_bg.png) no-repeat;
    background-size: contain;
    font-size: 24rpx;
    color: rgba(255, 255, 255, .84);

    .total_title {
      position: absolute;
      left: 20rpx;
      top: 15rpx;
      display: flex;
      align-items: center;

      image {
        width: 25rpx;
        margin-right: 4rpx;
      }
    }

    .number {
      vertical-align: baseline;

      text {
        color: #FFFFFF;
        font-size: 60rpx;
        margin-right: 20rpx;
      }
    }

  }

  .device_list {
    padding: 10rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    .device_item {
      box-sizing: border-box;
      padding: 10rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16rpx;
      width: 360rpx;
      height: 138rpx;
      border-radius: 5rpx;
      background-color: #FFFFFF;
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;

      .txt_info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;
        width: 180rpx;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        text {
          font-size: 24rpx;
          color: #afafaf;

          &:nth-of-type(1) {
            font-size: 30rpx;
            color: #000000;
            opacity: 0.85;
          }
        }
      }

      image {
        width: 90rpx;
        margin-left: 24rpx;
      }
    }
  }
</style>
