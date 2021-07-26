<template>
	<view class="deviceUnbind">
		<view class="header"></view>
		<view class="unbind">
			<view class="title">
				<text class="p_title">设备状态</text>
			</view>
			<view class="unbind_info">
				<view class="device_info">
					<image :src="require('./static/device_unbind.png')" mode="widthFix"></image>
					<view class="device_right">
						<view class="device_number">
							<view class="device_item">设备号</view>
							<view class="number_value">
								<input type="text" v-model="deviceCode" placeholder="扫一扫显示设备号" />
								<image :src="require('./static/op_icon_06.png')" mode="widthFix" @click="scanToShow"></image>
							</view>
						</view>
						<!-- <view class="device_status">
							<view class="device_item">设备状态</view>
							<view class="status_value">{{connectStatus}}</view>
						</view> -->
					</view>
				</view>
				<view class="confirmUnbind" @click="onUnbind">确定解绑设备</view>
			</view>

		</view>
	</view>
</template>
<script>
  import { httpOpUnbind } from '@/utils/request/api/operation.js'
	export default {
		data() {
			return {
				deviceCode: ''
			}
		},
		onLoad() {
		},
		methods: {
			scanToShow() {
			  uni.scanCode({
			    success: res => {
			      const {
			        result
			      } = res
			      // https://me.dc-box.com/scode/A20081001022
            const arr = result.split('/')
			      this.deviceCode = arr[arr.length - 1]
			    }
			  })
			},
			async onUnbind() {
        if (!this.deviceCode) return uni.showToast({
          title: '请输入设备编号',
          icon: 'none'
        })
        const { res } = await httpOpUnbind({ machine_id: this.deviceCode })
        uni.showToast({
          title: '解绑成功'
        })
			}
		}
	}
</script>
<style lang="less" scoped>
	.deviceUnbind {
		position: relative;
		display: flex;
		flex-direction: column;
		align-items: center;
		.header {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 162rpx;
			background-color: #FF5449;
		}
		.unbind {
			width: 720rpx;
			height: 470rpx;
			background: #FFFFFF;
			border-radius: 6rpx;
			display: flex;
			flex-direction: column;
			z-index: 2;
			padding: 0 20rpx;
			box-sizing: border-box;
			.unbind_info {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
			.title {
				height: 70rpx;
				line-height: 70rpx;
				font-weight: 700;
				border-bottom: 1rpx solid #dddddd;
			}
			.device_info {
				display: flex;
				align-items: center;
				margin-top: 20rpx;
				image {
					width: 146rpx;
					margin-left: 20rpx;
				}
				.device_right {
					display: flex;
					flex-direction: column;
					.device_number {
						display: flex;
						align-items: center;
						margin-bottom: 20rpx;
						.number_value {
							display: flex;
							input {
								width: 260rpx;
							}
							image {
								width: 40rpx;
							}
						}
					}
					.device_item {
						width: 120rpx;
						font-size: 30rpx;
						margin: 0 20rpx;
					}
					.device_status {
						display: flex;
						.status_value {
							color: #000000;
							font-weight: 300;
						}
					}
				}

			}
		}
	}
	.confirmUnbind {
		font-size: 30rpx;
		color: #FFFFFF;
    width: 700rpx;
    height: 70rpx;
    background: #FF8D36;
    border-radius: 5px;
    // margin: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 50rpx auto;
	}
</style>
