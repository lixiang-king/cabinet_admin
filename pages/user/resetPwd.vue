<template>
	<view class="pwd_info">
		<view class="pwd_item">
			<view class="pwd_key">原密码</view>
			<input type="text" v-model="form.old_password" placeholder="填写原密码" placeholder-style="font-size:24rpx" />
		</view>
		<view class="pwd_item">
			<view class="pwd_key">新密码</view>
			<input type="text" v-model="form.new_password" placeholder="填写新密码" placeholder-style="font-size:24rpx" />
		</view>
		<view class="pwd_item">
			<view class="pwd_key">确认新密码</view>
			<input type="text" v-model="form.confirm_new_password" placeholder="再次填写新密码" placeholder-style="font-size:24rpx" />
		</view>
		<view class="pwd_commit" @click="onSubmit">提交</view>
	</view>
</template>
<script>
  import { httpUserPwdUpdate } from '../../utils/request/api/user.js'
	export default{
    data() {
      return {
        form: {
          old_password: '',
          new_password: '',
          confirm_new_password: ''
        }
      }
    },
		methods:{
			onSubmit(){
        const { new_password, confirm_new_password } = this.form
        if (!this.form.old_password || !new_password) {
          return uni.showToast({
            title: '请输入密码',
            icon: 'none'
          })
        }
        if (new_password !== confirm_new_password) {
          return uni.showToast({
            title: '两次密码不一致,请重新输入',
            icon: 'none'
          })
        }
        httpUserPwdUpdate(this.form).then(res => {
            uni.showToast({
              title: '修改成功'
            })
            uni.switchTab({
              url: '/pages/user/user'
            })
        })
			}
		}
	}
</script>
<style lang="less" scoped>
	.pwd_info {
		height: 404rpx;
		background: #FFFFFF;
		display: flex;
		flex-direction: column;
		margin-top: 14rpx;
		.pwd_item {
			display: flex;
			width: 720rpx;
			margin: auto;
			border-bottom: 1rpx solid #B5B5B5;
			margin-bottom: 12rpx;
			.pwd_key {
				font-size: 30rpx;
				width: 200rpx;
				margin-left: 30rpx;
			}
			input {
				width: 500rpx;
			}
		}
		.pwd_commit {
			width: 730rpx;
			height: 71rpx;
			background: #FF8D36;
			border-radius: 5px;
			margin: 32rpx 10rpx;
			display: flex;
			justify-content: center;
			align-items: center;
      font-size: 30rpx;
      color: #FFFFFF;
		}
	}
</style>