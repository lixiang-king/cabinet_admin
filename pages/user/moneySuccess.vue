<template>
	<view class="price-info">
		<view class="price-commit">
			<view class="price1">
				<image src="../../static/img/user/money-success-commit.png" mode="widthFix"></image>
				<view class="commit">
					提现申请已提交
				</view>
				<view class="info">
					提现后24小时内到账，若未及时到账，请联系客服人员
				</view>
			</view>
			<view class="price2">
				<view class="account">
					<view class="price-key">
						<text>收款账户</text>
					</view>
					<view class="price-value">
						{{ typeName }}
					</view>
				</view>
				<view class="money">
					<view class="price-key">
						<text>提现金额</text>
					</view>
					<view class="price-value">
						{{ price }}元
					</view>
				</view>
			</view>
		</view>
		<view class="promise">
			<view class="makeSure" @click="makeSure">确定</view>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				price: 0
			}
		},
    computed: {
      typeName() {
        if (this.type === '1') {
          return '微信'
        } else {
          return '银行卡'
        }
      }
    },
		methods: {
			makeSure() {
				console.log("确定")
			}
		},
    onLoad (option) {
      this.type = option.type
      this.price = option.price
    }
	}
</script>
<style lang="less" scoped>
	.price-commit {
		width: 730rpx;
		height: 794rpx;
		background: #FFFFFF;
		border-radius: 5px;
		margin: 25rpx 10rpx;
	}
	.price1 {
		display: flex;
		flex-direction: column;
		align-items: center;
		image {
			width: 150rpx;
			height: 150rpx;
			background: #FF5449;
			border-radius: 50%;
			margin-top: 152rpx;
		}
		.commit {
			font-size: 30rpx;
			color: #333333;
			margin-top: 20rpx;
		}
		.info {
			text-align: center;
			font-size: 24rpx;
			color: #999999;
			margin-top: 20rpx;
			padding-bottom: 150rpx;
			border-bottom: 1rpx solid #CCCCCC;
		}
	}
	.price2 {
		display: flex;
		flex-direction: column;
		.account {
			display: flex;
			justify-content: space-between;
			.price-key {
				font-size: 30rpx;
				color: #333333;
				margin-top: 50rpx;
				margin-left: 80rpx;
			}
			.price-value {
				font-size: 30rpx;
				color: #333333;
				margin-top: 50rpx;
				margin-right: 80rpx;
			}
		}
		.money {
			display: flex;
			justify-content: space-between;
			.price-key {
				font-size: 30rpx;
				color: #333333;
				margin-top: 50rpx;
				margin-left: 80rpx;
			}
			.price-value {
				font-size: 30rpx;
				color: #333333;
				margin-top: 50rpx;
				margin-right: 80rpx;
			}
		}
	}
	.promise {
		width: 730rpx;
		height: 71rpx;
		background: #FF8D35;
		border-radius: 5px;
		margin: 40rpx 10rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		.makeSure {
			font-size: 30rpx;
			color: #FFFFFF;
		}
	}
</style>
