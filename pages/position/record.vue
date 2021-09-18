<template>
  <view class="">
    <view class="search_block">
      <view class="search_input">
        <image src="../../static/img/public/search.png" mode="widthFix"></image>
        <input type="text" confirm-type="search" :value="goodsName" placeholder="请输入商品名称" @input="onSearchInput" />
      </view>
      <text class="search" @click="toSearch">搜索</text>
    </view>
    <view class="date_picker">
      <p-date-picker @start="onStartDate" @end="onEndDate"></p-date-picker>
    </view>
    <view class="type_select">
      <view class="label">{{ typeName }}类型</view>
      <picker @change="onPickerChange" :range="stockType" class="value">
        <view style="width: 100%;">{{ stockTypeName ? stockTypeName : '请选择类型' }}</view>
      </picker>
    </view>
    <view class="list" v-if="dataList.length">
      <view class="list_item" v-for="(item, index) in dataList" :key="index">
        <view class="item_title">{{ item.goods_name }}</view>
        <view class="item_content">
          <view class="content_item">
            <view>{{ typeName }}数量：</view>
            <view>{{ item.sum }}</view>
          </view>
          <view class="content_item">
            <view class="label">{{ typeName }}类型：</view>
            <view v-if="type === 1">{{ item.stock_in_type }}入库</view>
            <view v-else>{{ item.stock_out_type }}出库</view>
          </view>

          <view class="content_item">
            <view class="label">{{ typeName }}人：</view>
            <view>{{ item.operator }}</view>
          </view>
          <view class="content_item">
            <view>{{ typeName }}时间：</view>
            <view>{{ item.time }}</view>
          </view>
        </view>
      </view>
    </view>
    <view class="c_empty_box" v-else>
      <image src="../../static/img/public/empty.png" mode="widthFix"></image>
      暂无内容
    </view>
  </view>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import {
    httpStockInRecord,
    httpStockOutRecord
  } from '@/utils/request/api/position.js'
  export default {
    data() {
      return {
        type: 1,
        goodsName: '',
        start_date: '',
        end_date: '',
        dataList: [],
        stockType: [],
        pickerIndex: 0
      }
    },
    computed: {
      ...mapState(['XPlaceId']),
      typeName() {
        if (this.type === 1) {
          return '入库'
        } else {
          return '出库'
        }
      },
      stockTypeName() {
        if (this.stockType.length === 0) {
          return ''
        } else {
          return this.stockType[this.pickerIndex]
        }
      }
    },
    methods: {
      onPickerChange(e) {
        this.pickerIndex = e.target.value
        this.getDataList()
      },
      onSearchInput(e) {
        this.goodsName = e.target.value
      },
      toSearch() {
        this.getDataList()
      },
      onStartDate(date) {
        this.start_date = date
        this.getDataList()
      },
      onEndDate(date) {
        this.end_date = date
        this.getDataList()
      },
      // 入库
      async getStockInRecord() {
        const params = {
          start_date: this.start_date,
          end_date: this.end_date,
          place_id: this.XPlaceId,
          stock_in_type: this.stockTypeName,
          goods_name: this.goodsName
        }
        const { msg } = await httpStockInRecord(params)
        const stockType = msg.stock_in_type
        stockType.unshift('全部')
        this.stockType = stockType
        this.dataList = msg.stock_in_record
      },
      // 出库
      async getStockOutRecord() {
        const params = {
          start_date: this.start_date,
          end_date: this.end_date,
          place_id: this.XPlaceId,
          stock_out_type: this.stockTypeName,
          goods_name: this.goodsName
        }
        const { msg } = await httpStockOutRecord(params)
        const stockType = msg.stock_out_type
        stockType.unshift('全部')
        this.stockType = stockType
        this.dataList = msg.stock_out_record
      },
      getDataList() {
        if (this.type === 2) {
          this.getStockOutRecord()
        } else {
          this.getStockInRecord()
        }
      }
    },
    onLoad(option) {
      const type = Number(option.type)
      this.type = type
      if (type === 2) {
        uni.setNavigationBarTitle({
          title: '出库记录'
        })
      } else {
        uni.setNavigationBarTitle({
          title: '入库记录'
        })
      }
      this.getDataList()
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

  .type_select {
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
    }

  }

  .list {
    padding: 0 10rpx;
    color: #333333;

    .list_item {
      background-color: #FFFFFF;
      margin-top: 10rpx;
      padding: 15rpx;

      .item_title {
        font-size: 30rpx;
        color: #000000;
        font-weight: bold;
        line-height: 60rpx;
      }

      .item_content {
        .content_item {
          display: flex;
          justify-content: space-between;
        }
      }
    }
  }
</style>
