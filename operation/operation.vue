<template>
	<view class="operation_manage">
		<view class="operation_label" @click="lamplight" v-if="XLoginInfo.role !== '2'">
			<image :src="require('./static/op_icon_01.png')" mode="widthFix"></image>
			<view class="operation">灯光设置</view>
		</view>
		<view class="operation_label" @click="toDeviceTest" v-if="XLoginInfo.role !== '2'">
			<image :src="require('./static/op_icon_02.png')" mode="widthFix"></image>
			<view class="operation">设备测试</view>
		</view>
		<view class="operation_label" @click="toDeviceUnbind" v-if="XLoginInfo.role !== '2'">
			<image :src="require('./static/op_icon_03.png')" mode="widthFix"></image>
			<view class="operation">设备解绑</view>
		</view>
		<view class="operation_label" @click="toSupplyAdd">
			<image :src="require('./static/op_icon_04.png')" mode="widthFix"></image>
			<view class="operation">补货</view>
		</view>
		<view class="operation_label" @click="toPower" v-if="XLoginInfo.role !== '2'">
			<image class="electric_charge" :src="require('./static/op_icon_05.png')" mode="widthFix"></image>
			<view class="operation">电量预警</view>
		</view>
		<view class="operation_label" @click="toUnScan" v-if="XLoginInfo.role !== '2'">
			<image :src="require('./static/op_icon_06.png')" mode="widthFix"></image>
			<view class="operation">未扫码预警</view>
		</view>
		<view class="operation_label" @click="toSupplyShort">
			<image :src="require('./static/op_icon_07.png')" mode="widthFix"></image>
			<view class="operation">缺货统计</view>
		</view>
	</view>
</template>
<script>
  import {
  	mapState
  } from 'vuex'
	export default {
    computed: {
      ...mapState([
        'XLoginInfo'
      ])
    },
		methods: {
			lamplight() {
        console.log(45)
				uni.navigateTo({
					url: '/operation/lamplight'
				})
			},
      toDeviceTest() {
      	uni.navigateTo({
      		url: '/operation/deviceTest'
      	})
      },
      toDeviceUnbind() {
      	uni.navigateTo({
      		url: '/operation/deviceUnbind'
      	})
      },
      toSupplyAdd() {
      	uni.navigateTo({
      		url: '/operation/supplyAdd'
      	})
      },
      toPower() {
      	uni.navigateTo({
      		url: '/operation/power'
      	})
      },
      toUnScan() {
      	uni.navigateTo({
      		url: '/operation/unScan'
      	})
      },
      toSupplyShort() {
      	uni.navigateTo({
      		url: '/operation/supplyShort'
      	})
      }
		}
	}
</script>
<style lang="less" scoped>
	.operation_manage {
		padding: 8rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: left;

		image {
			width: 94rpx;
		}
		
		.electric_charge{
			width: 66rpx;	
		}

		.operation_label {
			width: 360rpx;
			height: 220rpx;
			background-color: #FFFFFF;
			margin-bottom: 8rpx;

			&:nth-of-type(even) {
				margin-left: 8rpx;
			}

			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}
	}
</style>
