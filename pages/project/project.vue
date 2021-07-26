<template>
  <view class="project_page">
    <SearchHeader placeholder="代理名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
    <view class="device_list" v-if="dataList.length">
      <view class="device_item" v-for="item in dataList" :key="item.programme_id" @click="toEdit(item)">
        <view class="txt_info">
          <text>{{ item.place_name }}</text>
          <text>点位名称</text>
        </view>
        <image src="../../static/img/manage/manage_buildings.png" mode="widthFix"></image>
      </view>
    </view>
    <view class="c_empty_box" v-else>
      <image src="../../static/img/public/empty.png" mode="widthFix"></image>
      暂无内容
    </view>
    <view class="bottom_btn" @click="toEdit()">
      添加方案
    </view>
  </view>
</template>


<script>
  import {
    httpProList
  } from '@/utils/request/api/programme.js'
  export default {
    data() {
      return {
        searchName: '',
        region: [],
        dataList: []
      }
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
      toEdit(item) {
        if (item) {
          uni.navigateTo({
            url: '/pages/project/edit?id=' + item.programme_id + '&placeId=' + item.place_id
          })
        } else {
          uni.navigateTo({
            url: '/pages/project/edit'
          })
        }
      },
      async getDataList() {
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : ''
        }
        const {
          msg
        } = await httpProList(params)
        this.dataList = msg.programme_list
      }
    },
    onShow() {
      this.getDataList()
    }
  }
</script>

<style lang="less">
  .project_page {
    margin-bottom: 100rpx;
  }

  .device_list {
    padding: 10rpx;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    // margin-top: 10rpx;

    .device_item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16rpx;
      box-sizing: border-box;
      padding: 20rpx;
      width: 360rpx;
      height: 138rpx;
      border-radius: 5rpx;
      background-color: #ffffff;
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27),
        0 0 40rpx rgba(0, 0, 0, 0.06) inset;

      .txt_info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: left;

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
        min-width: 90rpx;
        width: 90rpx;
        margin-left: 24rpx;
      }
    }
  }
</style>
