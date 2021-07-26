<template>
	<view class="pos_page">
		<SearchHeader placeholder="代理名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
    <view class="stock_list" v-if="dataList.length">
      <view class="list_item" v-for="item in dataList" :key="item.channel_id" @click="toDetail(item)">
        <image src="../../static/img/manage/manage_buildings.png" mode="widthFix"></image>
        <view class="stock_info">
          <view>{{ item.channel_name }}</view>
          <view>{{ item.channel_tel }}</view>
        </view>
        <view class="values">
          <view class="values_item">
            <view class="label">库存数：</view>
            <view class="val">{{ item.stock_num ? item.stock_num : 0 }}</view>
          </view>
          <view class="values_item">
            <view class="label">售卖数：</view>
            <view class="val">{{ item.sale_num ? item.sale_num : 0 }}</view>
          </view>
        </view>
        <view class="values">
          <view class="values_item">
            <view class="label">入库数：</view>
            <view class="val">{{ item.stock_in ? item.stock_in: 0 }}</view>
          </view>
          <view class="values_item">
            <view class="label">设备台数：</view>
            <view class="val">{{ item.machine_sum ? item.machine_sum : 0 }}</view>
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
  import { mapMutations } from 'vuex'
  import { httpStockList } from '@/utils/request/api/stock.js'
	export default {
		data() {
			return {
        searchName: '',
        region: [],
				dataList: []
			};
		},
    methods: {
      ...mapMutations(['setChannelId']),
      onSelectRegion(region) {
      	this.region = region
        this.getDataList()
      },
      onSearch(value) {
        this.searchName = value
        this.getDataList()
      },
      toDetail (record) {
        this.setChannelId(record.channel_id)
        uni.showActionSheet({
            itemList: ['库存详情', '入库记录', '出库记录'],
            success: res => {
              if (res.tapIndex === 0) {
                uni.navigateTo({
                  url: '/pages/stock/detail'
                })
              } else {
                uni.navigateTo({
                  url: '/pages/stock/record?type=' + res.tapIndex
                })
              }
            },
            fail: res => {
                console.log(res.errMsg);
            }
        })
        // uni.navigateTo({
        //   url: '/pages/stock/menu'
        // })
      },
      async getDataList () {
        const params = {
          channel_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : ''
        }
        const { msg } = await httpStockList(params)
        this.dataList = msg.channel_list
      }
    },
    onLoad () {
      this.getDataList()
    }
	}
</script>

<style lang="less" scoped>
  .stock_list {
    padding: 15rpx;
    .list_item {
      display: flex;
      align-items: center;
      padding: 30rpx;
      margin-bottom: 15rpx;
      background-color: #FFFFFF;
      image {
        width: 90rpx;
        height: 90rpx;
        margin-right: 25rpx;
      }
      .stock_info {
        width: 260rpx;
        font-size: 24rpx;
        view {
          &:nth-of-type(1) {
            font-weight: bold;
            font-size: 30rpx;
            margin-bottom: 16rpx;
          }
          text {
            color: #E44A58;
          }
        }
      }
      .values {
        .values_item {
          display: flex;
          &:nth-of-type(1) {
            margin-bottom: 16rpx;
          }
          .label {
            width: 150rpx;
            text-align: right;
          }
          .val {
            color: #E34554;
          }
        }
      }
    }
  }

</style>
