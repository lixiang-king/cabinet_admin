<template>
  <view class="agent_in">
    <SearchHeader placeholder="代理名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
    <view class="c_header_total">
      <view class="total_title">
        <image src="../../static/img/manage/device_total_icon.png" mode="widthFix"></image>
        代理个数
      </view>
      <view class="number"><text>{{ channel_count }}</text>个</view>
    </view>
    <view class="agents_list" v-if="dataList.length">
      <view class="list_item" v-for="item in dataList" :key="item.channel_id" @click="toEdit(item.channel_id)">
        <view class="item_left">
          <image src="../../static/img/user/avatar.png" mode="widthFix"></image>
          <view class="info">
            <view class="agent_name">{{ item.channel_name }}</view>
            <view>持有设备: {{ item.machine_count }}</view>
          </view>
        </view>
        <view class="item_right">
          <view>
            <text class="item_label">分成总额：</text>
            <text class="item_value">¥{{ item.total_price }}</text>
          </view>
          <view>
            <text class="item_label">可提现：</text>
            <text class="item_value">¥{{ item.surplus_price }}</text>
          </view>
        </view>
      </view>
    </view>
    <view class="c_empty_box" v-else>
      <image src="../../static/img/public/empty.png" mode="widthFix"></image>
      暂无内容
    </view>
    <view class="bottom_btn" @click="toEdit()">
      <image src="../../static/img/manage/agent_add.png" mode="widthFix"></image>
      添加代理
    </view>
  </view>
</template>

<script>
  import {
    httpAgentList
  } from '@/utils/request/api/agent.js'
  export default {
    data() {
      return {
        dataList: [],
        searchName: '',
        region: [],
        channel_count: 0
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
      toEdit(id) {
        if (id) {
          uni.navigateTo({
            url: '/pages/agent/edit?id=' + id
          })
        } else {
          uni.navigateTo({
            url: '/pages/agent/edit'
          })
        }
      },
      async getDataList() {
        const params = {
          channel_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : ''
        }
        const { msg } = await httpAgentList(params)
        this.dataList = msg.channel_list
        this.channel_count = msg.channel_count
      }
    },
    onShow() {
      this.getDataList()
    }
  }
</script>

<style lang="less">
  .agents_list {
    margin-bottom: 100rpx;

    .list_item {
      height: 116rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #FFFFFF;
      padding: 8rpx;
      margin: 0 20rpx;
      margin-top: 10rpx;
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27), 0 0 40rpx rgba(0, 0, 0, 0.06) inset;
      border-radius: 4rpx;

      .item_left {
        display: flex;
        align-items: center;

        image {
          width: 86rpx;
          margin-right: 60rpx;
        }

        .info {
          display: flex;
          flex-direction: column;
          align-items: left;
          font-size: 24rpx;
          color: rgba(0, 0, 0, .5);

          .agent_name {
            font-size: 30rpx;
            color: rgba(0, 0, 0, .9);
          }
        }
      }

      .item_right {
        display: flex;
        flex-direction: column;
        // align-items: right;
        text-align: left;
        font-size: 24rpx;
        color: rgba(0, 0, 0, .9);
        width: 230rpx;
        .item_label {
          width: 150rpx;
          text-align: right;
        }
          
        .item_value {
          color: #FF5449;
        }
      }
    }
  }
</style>
