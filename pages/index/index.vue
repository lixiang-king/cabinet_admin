<template>
  <view class="content">
    <view class="focus">
      <image :src="XLoginInfo.headerimg_url" mode="widthFix"></image>
      <text>{{ XLoginInfo.username }}</text>
    </view>
    <view class="manage_list">
      <view class="list_item" v-for="item in manage_list" :key="item.title" @click="toDetail(item)" v-if="rootList.includes(item.type)">
       <image :src="item.icon" mode="widthFix"></image>
       {{ item.title }}
      </view>
      <!-- <image src="../../static/img/manage/manage_01.png" mode=""></image> -->
    </view>
  </view>
</template>
<script>
  import { mapState, mapMutations } from 'vuex'
	export default {
    computed: {
      ...mapState(['XLoginInfo']),
      rootList () {
        // 1点位管理 2设备管理 3代理设置 4方案管理 5运营日报
        // 6运营周报 7运营月报 8订单管理 9库存管理 10运维管理
        const { level, role } = this.XLoginInfo
        if (level === '1' && role === '1') {
          return [1, 2, 5, 6, 7, 8, 10]
        } else if (role === '2') {
          return [2, 10]
        } else if (role === '3') {
          return [1, 2, 4, 10]
        } else if (level === '4') {
          return [2, 5, 6, 7, 8]
        } else if (level === '6') {
          return [2, 5, 6, 7, 8]
        } else {
          return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        }
      }
    },
		data() {
			return {
        manage_list: [
          {
            type: 1,
            title: '点位管理',
            icon: '../../static/img/manage/manage_01.png',
            path: '/pages/position/position'
          },
          {
            type: 2,
            title: '设备管理',
            icon: '../../static/img/manage/manage_02.png',
            path: '/pages/device/device'
          },
          {
            type: 3,
            title: '代理设置',
            icon: '../../static/img/manage/manage_03.png',
            path: '/pages/agent/agent'
          },
          {
            type: 4,
            title: '方案管理',
            icon: '../../static/img/manage/manage_04.png',
            path: '/pages/project/project'
          },
          {
            type: 5,
            title: '运营日报',
            icon: '../../static/img/manage/manage_05.png',
            path: '/pages/report/report?type=1'
          },
          {
            type: 6,
            title: '运营周报',
            icon: '../../static/img/manage/manage_06.png',
            path: '/pages/report/report?type=2'
          },
          {
            type: 7,
            title: '运营月报',
            icon: '../../static/img/manage/manage_07.png',
            path: '/pages/report/report?type=3'
          },
          {
            type: 8,
            title: '订单管理',
            icon: '../../static/img/manage/manage_08.png',
            path: '/pages/order/order'
          },
          {
            type: 9,
            title: '库存管理',
            icon: '../../static/img/manage/manage_09.png',
            path: '/pages/stock/stock'
          },
          {
            type: 10,
            title: '运维管理',
            icon: '../../static/img/manage/manage_10.png',
            path: '/operation/operation'
          }
        ]
			}
		},
		onLoad() {

		},
		methods: {
      handleVisible (type) {
        const { level, role } = this.XLoginInfo
        if (type === 1) {
          if (level === '1' && role === '1') {
            
          }
        }
      },
      toDetail(item) {
        uni.navigateTo({
          url: item.path
        })
      }
		}
	}
</script>

<style lang="less" scoped>
  .content {
    background-color: #f4f4f4;
    .focus {
      width: 100%;
      height: 300rpx;
      background: url('../../static/img/manage/home_banner.png') no-repeat;
      background-size: contain;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      image {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        margin-bottom: 10rpx;
      }
      text {
        color: #FFFFFF;
      }
    }
    .manage_list {
      padding: 80rpx;
      padding-top: 0rpx;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      .list_item {
        margin-top: 80rpx;
        width: 255rpx;
        height: 255rpx;
        border-radius: 20rpx;
        background-color: #FFFFFF;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #333333;
        &:nth-of-type(even) {
          margin-left: 80rpx;
        }
        image {
          width: 110rpx;
          height: 110rpx;
        }
      }
    }
  }

</style>
