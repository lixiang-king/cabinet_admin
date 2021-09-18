<template>
  <view class="role_manager">
    <!-- <view class="role_label" @click="toAdd">
      <image src="../../static/img/user/user-tie-solid.png" mode="widthFix"></image>
      <view class="role">代理</view>
    </view> -->
    <view class="role_label" @click="toList(1)">
      <image src="../../static/img/user/user-run.png" mode="widthFix"></image>
      <view class="role">运维</view>
    </view>
    <view class="role_label" @click="toList(2)">
      <image src="../../static/img/user/user-seller.png" mode="widthFix"></image>
      <view class="role">补货员</view>
    </view>
    <view class="role_label" @click="toList(3)" v-if="isIntroShow">
      <image src="../../static/img/user/user-shared-2-line.png" mode="widthFix"></image>
      <view class="role">介绍人</view>
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
      ]),
      isIntroShow () {
        const res = true
        if (this.XLoginInfo.level === '1' && this.XLoginInfo.role === '1') {
          return false
        }
        return res
      }
    },
    methods: {
      toList (type) {
        uni.navigateTo({
          url: '/pages/user/roleList?type=' + type
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  .role_manager {
    padding: 10rpx;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    image {
      width: 96rpx;
    }

    .role_label {
      width: 360rpx;
      height: 220rpx;
      background-color: #ffffff;
      margin-bottom: 15rpx;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      &:nth-of-type(even) {
        margin-left: 8rpx;
      }
    }
  }
</style>
