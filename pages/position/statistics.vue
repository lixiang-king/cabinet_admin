<template>
  <view class="sta_more_page">
    <view class="date_picker_page">
      <view class="label p_title">时间间隔</view>
      <view class="value">
        <picker mode="date" :value="start_date" @change="onStartDateChange">
          <view class="start_date">{{ start_date ? start_date : '开始时间' }}</view>
        </picker>
        <view class="spliter">-</view>
        <picker mode="date" :value="end_date" @change="onEndDateChange">
          <view class="end_date">{{ end_date ? end_date : '结束时间' }}</view>
        </picker>
      </view>
    </view>
    <view class="sta_total">
      <view class="total_item">
        <view class="title">总成交额</view>
        <view class="">
          <text>{{ staInfo.total_price }}</text>¥
        </view>
      </view>
      <view class="total_item">
        <view class="title">订单数</view>
        <view class="">
          <text>{{ staInfo.order_sum }}</text>单
        </view>
      </view>
      <view class="total_item">
        <view class="title">成交率</view>
        <view class="">
          <text>{{ staInfo.deal_rate }}</text>%
        </view>
      </view>
      <view class="total_item">
        <view class="title">机器数量</view>
        <view class="">
          <text>{{ staInfo.machine_sum }}</text>台
        </view>
      </view>
      <view class="total_item">
        <view class="title">扫码数</view>
        <view class="">
          <text>{{ staInfo.scan_code_num }}</text>次
        </view>
      </view>
      <view class="total_item">
        <view class="title">动销</view>
        <view class="">
          <text>{{ staInfo.dx }}</text>%
        </view>
      </view>
    </view>
    <view class="sta_tables">
      <view class="device_name">
        <view>机器编号</view>
        <view v-for="item in machine_id_list" :key="item">{{ item }}</view>
      </view>
      <scroll-view class="scroll-view_H" scroll-x="true">
        <view class="scroll_box">
          <view class="column">
            <view>机器名称</view>
            <view v-for="item in machine_name_list" :key="item">{{ item }}</view>
          </view>
          <view class="column">
            <view>扫码次</view>
            <view v-for="item in scan_num_list" :key="item">{{ item }}</view>
          </view>
          <view class="column">
            <view>成交量</view>
            <view v-for="item in sum_list" :key="item">{{ item }}</view>
          </view>
          <view class="column">
            <view>成交率</view>
            <view v-for="item in rate_list" :key="item">{{ item }}</view>
          </view>
          <view class="column">
            <view>成交额</view>
            <view v-for="item in price_list" :key="item">{{ item }}</view>
          </view>
          <view class="column">
            <view>动销</view>
            <view v-for="item in dx_list" :key="item">{{ item }}</view>
          </view>
        </view>
      </scroll-view>

    </view>
  </view>
</template>

<script>
  import {
    httpPlaceSta
  } from '@/utils/request/api/position.js'
  import {
    mapState
  } from 'vuex'
  export default {
    computed: {
      ...mapState(['XPlaceId']),
      machine_id_list() { // 机器编号
        return this.dataList.map(item => item.machine_id)
      },
      machine_name_list() { // 机器名称
        return this.dataList.map(item => item.machine_name)
      },
      scan_num_list() { // 扫码次数
        return this.dataList.map(item => item.scan_code_num)
      },
      sum_list () { // 成交量
        return this.dataList.map(item => item.sum)
      },
      rate_list () { // 成交率
        return this.dataList.map(item => item.deal_rate)
      },
      price_list () { // 成交额
        return this.dataList.map(item => item.price)
      },
      dx_list () { // 动销
        return this.dataList.map(item => item.dx)
      }
    },
    data() {
      return {
        start_date: '',
        end_date: '',
        dataList: [],
        staInfo: {}
      }
    },
    methods: {
      onSelectRegion(region) {
        console.log(region, 'region')
      },
      onSearch(value) {
        console.log(value, 'search')
      },
      onStartDateChange(e) {
        const res = e.target.value
        this.start_date = res
      },
      onEndDateChange(e) {
        const res = e.target.value
        this.end_date = res
      },
      async getDataList() {
        const params = {
          start_date: this.start_date,
          end_date: this.end_date,
          place_id: this.XPlaceId
        }
        const { msg } = await httpPlaceSta(params)
        this.staInfo = msg
        this.dataList = msg.place_data
      }
    },
    onLoad() {
      this.getDataList()
    }
  }
</script>

<style lang="less" scoped>
  .sta_more_page {
    .date_picker_page {
      padding: 0 30rpx;
      height: 70rpx;
      background-color: #FFFFFF;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #bcbcbc;
      font-size: 30rpx;

      .label {
        width: 120rpx;
        // margin-right: 36rpx;
        color: #595959;
      }

      .value {
        width: 500rpx;
        display: flex;
        align-items: center;

        // justify-content: center;
        .spliter {
          margin: 0 50rpx;
        }
      }

    }

    .sta_total {
      padding: 0 15rpx;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;

      .total_item {
        margin-top: 10rpx;
        width: 240rpx;
        height: 97rpx;
        background: url(../../static/img/manage/position_total_bg.png) no-repeat;
        background-size: contain;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        font-size: 22rpx;
        color: #FFFFFF;

        .title {
          color: #FFFFFF;
          opacity: 0.85;
        }

        text {
          font-size: 30rpx;
          opacity: 1;
        }
      }
    }
  }

  .sta_tables {
    border-radius: 6rpx;
    padding: 15rpx;
    margin: 15rpx;
    display: flex;
    font-size: 28rpx;
    background-color: #FFFFFF;
    overflow: hidden;
    .device_name {
      view {
        width: 300rpx;
        height: 60rpx;
        padding: 0 5rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &:nth-of-type(1) {
          margin-bottom: 10rpx;
          font-weight: bold;
        }
      }
    }
    .scroll_box {
      margin-left: 20rpx;
      width: 1200rpx;
      display: flex;
      color: #333333;
      .column {
        view {
          width: 200rpx;
          height: 60rpx;
          padding: 0 5rpx;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &:nth-of-type(1) {
            margin-bottom: 10rpx;
            font-weight: bold;
          }
        }
      }
      // display: flex;
    }
  }
</style>
