<template>
	<view class="pos_page">
		<SearchHeader placeholder="点位名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
    <view class="c_header_total">
      <view class="total_title">
        <image src="../../static/img/manage/device_total_icon.png" mode="widthFix"></image>
        点位个数
      </view>
      <view class="number"><text>{{ place_conut }}</text>个</view>
    </view>
    <view class="stock_list" v-if="dataList.length">
      <view class="list_item" v-for="item in dataList" :key="item.place_id" @click="toDetail(item)">
        <image src="../../static/img/manage/manage_buildings.png" mode="widthFix"></image>
        <view class="stock_info">
          <view>{{ item.place_name }}</view>
          <view>{{ item.place_tel }}</view>
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
    <view class="bottom_btn" @click="toAdd">
    	<image src="../../static/img/manage/position_add.png" mode="widthFix"></image>
    	添加点位
    </view>
	</view>
</template>

<script>
  import { mapMutations } from 'vuex'
  import { httpPlaceList } from '@/utils/request/api/position.js'
	export default {
		data() {
			return {
        searchName: '',
        region: [],
				dataList: [],
        place_conut: 0
			};
		},
    methods: {
      ...mapMutations(['setPlaceId']),
      onSelectRegion(region) {
      	this.region = region
        this.getDataList()
      },
      onSearch(value) {
        this.searchName = value
        this.getDataList()
      },
      toDetail (record) {
        this.setPlaceId(record.place_id)
        uni.navigateTo({
          url: '/pages/position/positionMenu'
        })
      },
      toAdd () {
        uni.navigateTo({
          url: '/pages/position/positionEdit'
        })
      },
      async getDataList () {
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : ''
        }
        const { msg } = await httpPlaceList(params)
        this.dataList = msg.place_list
        this.place_conut = msg.place_conut
      }
    },
    onLoad () {
      this.getDataList()
    }
	}
</script>

<style lang="less" scoped>
  .pos_page {
    padding-bottom: 100rpx;
  }
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
