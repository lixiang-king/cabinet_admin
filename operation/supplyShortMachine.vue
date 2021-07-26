<template>
	<view class="total_page">
		<view class="title c_border_btm">
		  <view class="p_title">{{ pname }}</view>
		</view>
    <view class="list">
      <view class="list_item c_border_btm" v-for="item in dataList" :key="item.machineid">
        <image :src="require('./static/op_icon.png')" mode="widthFix"></image>
        <view class="info">
          <view class="info_title">{{ item.machine_name }}</view>
          <view class="info_value">
            <view>
              机器编号：{{ item.machineid }}
            </view>
            <view class="op">
              缺货数量：<text class="c_ac_color">{{ item.machine_shortage_num }}</text>
            ️</view>
          </view>
        </view>
        
      </view>
    </view>
	</view>
</template>

<script>
  import {
    httpOpStockoutDevice
  } from '@/utils/request/api/operation.js'
	export default {
		data() {
			return {
        id: '',
        pname: '',
        goodsName: '',
				dataList: []
			};
		},
    methods: {
      async getDataList () {
        const params = {
          pid: this.id
        }
        const { msg } = await httpOpStockoutDevice(params)
        this.goodsName = msg.goods_name
        this.dataList = msg.machine_shortage_info
      }
    },
    onLoad (option) {
      this.id = option.id
      this.pname = option.pname
      this.getDataList()
    }
	}
</script>

<style lang="less">
.total_page {
  margin: 15rpx;
  padding: 15rpx;
  background-color: #FFFFFF;
  .title {
    display: flex;
    align-items: center;
    height: 70rpx;
  }
  .list {
    .list_item {
      display: flex;
      align-items: center;
      padding: 30rpx 10rpx;
      color: #999999;
      &:nth-last-of-type(1) {
        border: none;
      }
      image {
        width: 80rpx;
        height: 104rpx;
        margin-right: 10rpx;
      }
      .info {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        .info_title {
          color: #333333;
          font-weight: bold;
          margin-bottom: 10rpx;
        }
        .info_value {
          width: 600rpx;
          color: #999999;
          font-size: 24rpx;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .op {
            font-size: 30rpx;
            display: flex;
            align-items: center;
          }
        }
      }
      
    }
  }
}
</style>
