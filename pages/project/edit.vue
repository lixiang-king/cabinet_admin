<template>
  <view>
    <view class="project_page" v-if="!isGoodsShow">
      <SearchHeader v-if="!id" placeholder="机器名称" @regionOk="onSelectRegion" @search="onSearch"></SearchHeader>
      <view class="project_info">
        <view class="info_item">
          <view class="p_title">{{ id ? '点位名称' : '选择点位'}}</view>
          <pSelect class="info_inp" v-if="!id" :range="place_info" @pickOk="onPickOk"></pSelect>
          <view v-else class="info_inp">{{ submitInfo.place_name }}</view>
        </view>
        <view class="info_item">
          <view class="p_title">方案名称</view>
          <input v-if="id" class="info_inp" type="text" v-model="submitInfo.programme_name" placeholder="请填写方案名称" />
          <input v-else class="info_inp" type="text" v-model="submitInfo.programme" placeholder="请填写方案名称" />
        </view>
        <view class="info_item">
          <view class="p_title">营销佣金</view>
          <input class="info_inp" type="text" v-model="submitInfo.marketing_money" placeholder="请填写营销佣金" />
        </view>
        <view class="info_item">
          <view class="p_title">介绍人分成</view>
          <input class="info_inp" type="text" v-model="submitInfo.introducer_money" placeholder="请填写介绍人分成金额" />
        </view>
        <!-- <view class="tips">
          *营销佣金要在营销活动里开启当前点位活动才有效
        </view> -->
      </view>
      <view class="goods_list">
        <view class="goods_item" v-for="(item, index) in goods_info" :key="item.hid">
          <!-- <image :src="item.small_img" mode="widthFix"></image> -->
          <div class="image" @click="toGoods(index)">
            <image v-if="item.small_img" :src="item.small_img" mode="widthFix"></image>
            <text>{{ item.hid }}</text>
          </div>
          <view class="item_info">
            <view class="info_item" @click="toGoods(index)">
              <view class="info_label">选择商品</view>
              <view :class="['info_inp', item.goods_name ? '' : 'place_holder']">{{ item.goods_name ? item.goods_name : '点击选择商品' }}</view>
            </view>
            <view class="info_item">
              <view class="info_label">商品售价</view>
              <input v-if="id" class="info_inp" type="text" :value="item.price" placeholder="请填写商品价格" @input="onGoodsPriceInp($event, item)" />
              <input v-else class="info_inp" type="text" :value="item.price" placeholder="请填写商品价格" @input="onGoodsPriceInp($event, item)" />
            </view>
            <view class="info_item">
              <view class="info_label">点位分成</view>
              <input class="info_inp" type="text" :value="item.place_money" placeholder="请填写点位分成金额" @input="onPlaceMoneyInp($event, item)" />
            </view>
          </view>
        </view>
      </view>
      <view class="bottom_btn" @click="onSubmit">
        提交
      </view>
    </view>
    <Goods v-if="isGoodsShow" :dataList="dataList" @ok="onGoodsOk"></Goods>
  </view>

</template>


<script>
  import {
    httpProInfo,
    httpProGoods,
    httpProAdd,
    httpProUpdate,
    httpProInfoById
  } from '@/utils/request/api/programme.js'
  import Goods from './Goods'
  export default {
    components: {
      Goods
    },
    data() {
      return {
        id: '',
        place_id: '',
        isGoodsShow: false,
        dataList: [],
        searchName: '',
        region: [],
        place_info: [],
        goods_info: [],
        programme_goods_info: [], //方案商品信息
        submitInfo: {
          place_id: '', // 点位id
          programme: '', //  方案名称
          introducer_money: '', // 介绍人分成
          marketing_money: '', // 营销佣金
        }
      }
    },
    methods: {
      onGoodsPriceInp(e, item) {
        const val = e.target.value
        item.price = val
      },
      onPlaceMoneyInp(e, item) {
        const val = e.target.value
        item.place_money = val
      },
      onPickOk(obj) {
        this.submitInfo.place_id = obj.place_id
      },
      onSelectRegion(region) {
        this.region = region
        this.getProAddInfo()
      },
      onSearch(value) {
        this.searchName = value
        this.getProAddInfo()
      },
      toGoods(index) {
        this.isGoodsShow = true
        this.goodsIndex = index
        uni.setNavigationBarTitle({
          title: '选择商品'
        })
        // uni.navigateTo({
        //   url: '/pages/project/goods'
        // })
      },
      onGoodsOk(item) {
        uni.setNavigationBarTitle({
          title: '方案添加'
        })
        this.isGoodsShow = false
        this.goods_info[this.goodsIndex].goods_name = item.goods_name
        this.goods_info[this.goodsIndex].goods_id = item.goods_id
        this.goods_info[this.goodsIndex].small_img = item.small_img
        this.goods_info[this.goodsIndex].price = item.goods_price
      },
      // 新增时获取方案信息
      async getProAddInfo() {
        const params = {
          machine_name: this.searchName,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : ''
        }
        const { msg } = await httpProInfo(params)
        // const { msg } = await httpProInfo()
        const goods_info = [...msg.goods_info]
        // goods_info.forEach(item => {
        //   item.price = ''
        //   item.place_money = ''
        // })
        const place_info = msg.place_info
        place_info.unshift({
          place: '请选择',
          place_id: null
        })
        this.place_info = place_info
        this.goods_info = msg.goods_info
      },
      async getDataList() {
        const params = {
          goods_name: this.searchName
        }
        const { msg } = await httpProGoods(params)
        this.dataList = msg.goods_info
      },
      async getProInfoById() {
        const params = {
          programme_id: this.id
        }
        const { msg } = await httpProInfoById(params)
        this.submitInfo = msg.programme_info
        this.goods_info = msg.programme_goods_info
      },
      handleEdit (params) {
        httpProUpdate(params).then(res => {
          uni.showToast({
            title: '修改成功'
          })
          setTimeout(() => {
            uni.navigateBack({
              url: '/pages/project/project'
            })
          }, 2000)
        })
      },
      handleAdd (params) {
        httpProAdd(params).then(res => {
          uni.showToast({
            title: '提交成功'
          })
          setTimeout(() => {
            uni.navigateBack({
              url: '/pages/project/project'
            })
          }, 2000)
        })
      },
      onSubmit() {
        const params = { ...this.submitInfo
        }
        if (this.id && !params.programme_name) {
          return uni.showToast({
            title: '请输入方案名称',
            icon: 'none'
          })
        }
        if (!this.id && !params.programme) {
          return uni.showToast({
            title: '请输入方案名称',
            icon: 'none'
          })
        }
        if (!params.marketing_money) {
          return uni.showToast({
            title: '请输入营销佣金',
            icon: 'none'
          })
        }
        if (!params.introducer_money) {
          return uni.showToast({
            title: '请输入介绍人佣金',
            icon: 'none'
          })
        }
        params.hd_info = JSON.stringify(this.goods_info)
        if (this.id) {
          params.programme_id = this.id
          params.place_id = this.place_id
          params.programme = params.programme_name
          this.handleEdit(params)
        } else {
          if (!params.place_id) {
            return uni.showToast({
              title: '请选择点位',
              icon: 'none'
            })
          }
          this.handleAdd(params)
        }
      }
    },
    onLoad(option) {
      this.id = option.id
      this.place_id = option.placeId
      if (this.id) { // 编辑
        uni.setNavigationBarTitle({
          title: '方案编辑'
        })
        this.getDataList()
        this.getProInfoById()
      } else { // 新增
        uni.setNavigationBarTitle({
          title: '添加方案'
        })
        this.getProAddInfo()
        this.getDataList()
      }
    }
  }
</script>

<style lang="less" scoped>
  .project_page {
    padding: 16rpx;
    padding-bottom: 100rpx;

    .project_info {
      margin-top: 16rpx;
      background-color: #ffffff;
      box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27),
        0 0 40rpx rgba(0, 0, 0, 0.06) inset;

      .info_item {
        display: flex;
        align-items: center;
        padding: 10rpx;
        border-bottom: 1rpx solid #cccccc;

        .info_inp {
          margin-left: 50rpx;
          // color: #999999;
        }
      }

      .tips {
        color: #e14250;
        text-align: center;
        font-size: 20rpx;
        padding: 20rpx;
      }
    }

    .goods_list {
      margin-bottom: 20rpx;
      .goods_item {
        display: flex;
        align-items: center;
        padding: 18rpx;
        background-color: #ffffff;
        margin-top: 14rpx;
        box-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.27),
          0 0 40rpx rgba(0, 0, 0, 0.06) inset;

        .image {
          position: relative;
          width: 148rpx;
          height: 148rpx;
          border-radius: 6rpx;
          background-color: rgba(236, 96, 82, 0.5);
          margin-right: 30rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFFFFF;
          image {
            width: 148rpx;
            height: 148rpx;
            position: absolute;
            left: 0;
            top: 0;
          }
        }

        .item_info {
          .info_item {
            display: flex;
            align-items: center;
            font-size: 24rpx;
            height: 50rpx;
            line-height: 50rpx;

            .info_label {
              color: #000000;
              width: 160rpx;
            }

            .info_inp {
              // color: #999999;
              font-size: 24rpx;
            }
          }
        }
      }
    }
    
    .place_holder {
      color: #999999;
    }
  }
</style>
