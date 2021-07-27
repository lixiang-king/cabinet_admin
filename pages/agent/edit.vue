<template>
  <view class="add_page">
    <view class="header"></view>
    <view class="container">
      <view class="edit_form">
        <view class="p_title">代理基本信息</view>
        <view class="form_item">
          <view class="label"><text class="label_icon">姓名</text></view>
          <input class="value" type="text" v-model="agentInfo.channel_name" placeholder="请输入姓名" />
        </view>
        <view class="form_item">
          <view class="label"><text class="label_icon">电话</text></view>
          <input class="value" type="text" :maxlength="11" v-model="agentInfo.channel_tel" placeholder="请输入电话" />
        </view>
        <view class="form_item">
          <view class="label"><text class="label_icon">所在地区</text></view>
          <pick-regions :defaultRegion="region" @getRegion="handleGetRegion">
            <view :class="['value', regionName ? '' : 'place_h']" style="fontSize: 30rpx; width: 400rpx;" @click="onPickerOpen">{{ regionName ? regionName : '请选择'}}</view>
          </pick-regions>
        </view>
      </view>
      <view class="tab-box">
        <view v-for="(item,index) in tabsList" :key="index" @click="toggleTabs(index)" class="item-tab" :class="{tabActive:index === activeIndex}">{{item}}</view>
      </view>
      <view class="price_box">
        <view class="box_title" v-if="activeIndex === 0">
          <view class="p_title">价格填写</view>
          <view class="add_btn" @click="onAddPrice">添加价格+</view>
        </view>
        <view class="box_title" v-else>
          <view class="p_title">明细填写</view>
          <view class="add_btn" @click="onAddPrice">添加明细+</view>
        </view>
        <view class="price_edit">
          <view class="edit_item" v-for="(item, index) in price_info" :key="index">
            <view class="product-img" v-if="activeIndex === 1">
              <image @click="handleChangeImg(index)" class="img" :src="item.product_img" mode="widthFix"></image>
            </view>
            <view class="item_info">
              <view class="label">售 价<text class="label_icon"></text></view>
              <input type="text" v-model="item.sale_price" />
            </view>
            <view class="item_info">
              <view class="label">分成金额<text class="label_icon"></text></view>
              <input type="text" v-model="item.share_price" />
            </view>
            <view class="del_btn" @click="onDel(item, index)"></view>
          </view>
        </view>
      </view>
    </view>
    <view class="bottom_btn" @click="toSubmit">
      <image src="../../static/img/user/role-agent-commit.png" mode="widthFix"></image>
      提交信息
    </view>
  </view>
</template>

<script>
  import {
    httpAgentAdd,
    httpAgentUpdate,
    httpAgentInfo
  } from '@/utils/request/api/agent.js'
  import { mapState } from 'vuex'
  export default {
    computed: {
      ...mapState(['PickItemImg',  'PickItemId']),
      regionName() {
        // 转为字符串
        return this.region.join('')
      }
    },
    data() {
      return {
        jumpIndex: 0,
        tabsList: ['按照价格', '按照产品'],
        activeIndex: 0,
        isShowRegion: false,
        region: [],
        agentInfo: {
          channel_name: '', //代理名称
          channel_tel: null, //代理电话号
          province: null, //省
          city: null, //市
          area: null //区
        },
        price_info: [{
          product_img: '../../static/img/public/circle.png',
          sale_price: 0,
          share_price: 0
        }],
        id: ''
      }
    },
    methods: {
      handleChangeImg(index) {
        this.jumpIndex = index
        uni.navigateTo({
            url:'/pages/project/edit?addProxy=1'
        });
      },
      toggleTabs(index){
        this.activeIndex = index;
      },
      onAddPrice() {
        const obj = {
          product_img: '../../static/img/public/circle.png',
          sale_price: 0,
          share_price: 0
        }
        this.price_info.push(obj)
      },
      onDel(item, index) {
        this.price_info.splice(index, 1)
      },
      onNameInput(e) {
        this.agentInfo.channel_name = e.target.value
      },
      handleGetRegion(region) {
        this.region = region
      },
      onPickerOpen() {
        this.isShowRegion = !this.isShowRegion
      },
      handleShareCheck(value, str) {
        let res = true
        if (!value && value !== 0) {
          uni.showToast({
            title: '请输入分成金额' + str,
            icon: 'none'
          })
          res = false
        }
        return res
      },
      handleFormCheck(params) {
        const paramsRules = [{
          name: 'name',
          required: true,
          type: 'required',
          errmsg: '请输入姓名'
        }, {
          name: 'tel',
          required: true,
          type: 'phone',
          errmsg: '请输入正确的代理电话'
        }, {
          name: 'province',
          required: true,
          type: 'required',
          errmsg: '请选择省市区'
        }, {
          name: 'city',
          required: true,
          type: 'required',
          errmsg: '请选择省市区'
        }, {
          name: 'area',
          required: true,
          type: 'required',
          errmsg: '请选择省市区'
        }]
        const regRes = this.$validate.validate(params, paramsRules)
        if (!regRes.isOk) {
          uni.showToast({
            title: regRes.errmsg,
            icon: 'none'
          })
          return false
        } 
        return true
      },
      // handleReset() {
      //   this.agentInfo = {
      //     channel_name: '', //代理名称
      //     channel_tel: null, //代理电话号
      //     share_price: null, //分成金额
      //     province: null, //省
      //     city: null, //市
      //     area: null //区
      //   }
      //   this.region = []
      // },
      async getAgentInfo() {
        const params = {
          channel_id: this.id
        }
        const {
          msg
        } = await httpAgentInfo(params)
        this.agentInfo = msg.channel_info
        this.region = [this.agentInfo.province, this.agentInfo.city, this.agentInfo.area]
        this.price_info = msg.price_info
      },
      toSubmit() {
        const {
          channel_name,
          channel_tel
        } = this.agentInfo
        const params = {
          channel_id: this.id,
          name: channel_name,
          tel: channel_tel,
          province: this.region[0] ? this.region[0] : '',
          city: this.region[1] ? this.region[1] : '',
          area: this.region[2] ? this.region[2] : ''
        }
        const regRes = this.handleFormCheck(params)
        if (!regRes) return
        // 校验金额
        for(let i = 0; i < this.price_info.length; i++) {
          const item = this.price_info[i]
          if(!item.sale_price) item.sale_price = 0
          if(!item.share_price) item.share_price = 0
        }
        params.price_info = JSON.stringify(this.price_info)
        if (this.id) {
          this.handleEdit(params)
        } else {
          this.handleAdd(params)
        }
        // console.log("已提交信息")
      },
      handleEdit(params) {
        params.channel_id = this.id
        httpAgentUpdate(params).then(res => {
          uni.showToast({
            title: '修改成功'
          })
          setTimeout(() => {
            uni.navigateBack({
              url: '/pages/agent/agent'
            })
          }, 2000)
        })
      },
      handleAdd(params) {
        httpAgentAdd(params).then(res => {
          uni.showToast({
            title: '添加成功'
          })
          setTimeout(() => {
            uni.navigateBack({
              url: '/pages/agent/agent'
            })
          }, 2000)
        })

      }
    },
    onLoad(option) {
      const id = option.id
      this.id = id
      if (id) {
        this.getAgentInfo()
      }
    },
    onShow(){
      console.log('onshow')
      console.log(this.PickItemImg)
      this.PickItemImg && (this.price_info[this.jumpIndex].product_img = this.PickItemImg)
    }
  }
</script>

<style lang="less" scoped>
  .label {
    width: 160rpx;
    text-align: left;
    font-size: 30rpx;
    color: rgba(0, 0, 0, 0.8);

    .label_icon {
      position: relative;

      &:after {
        content: "*";
        position: absolute;
        right: -20rpx;
        top: -10rpx;
        color: #e04050;
      }
    }
  }

  .add_page {
    position: relative;

    .header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 162rpx;
      background-color: #ff5449;
      // z-index: 1;
    }

    .container {
      padding: 30rpx 10rpx;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 710rpx;
      // height: 1050rpx;
      z-index: 2;
      background-color: #ffffff;
      border-radius: 6rpx;

      .edit_form {
        .form_item {
          height: 80rpx;
          display: flex;
          align-items: center;
          padding: 0 24rpx;
          border-bottom: 1rpx solid #b5b5b5;

          .place_h {
            color: rgba(0, 0, 0, 0.5);
          }
        }
      }

      .tab-box {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 24px 0;
        .item-tab {
          font-size: 24rpx;
          padding: 10rpx 20rpx;
          color: #fff;
          background-color: #ccc;
        }
        .tabActive {
          background-color: #EF730F;
        }
        .item-tab:first-child {
          border-top-left-radius: 6rpx;
          border-bottom-left-radius: 6rpx;
        }
        .item-tab:last-child {
          border-top-right-radius: 6rpx;
          border-bottom-right-radius: 6rpx;
        }
      }

      .price_box {
        margin-top: 50rpx;

        .box_title {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .add_btn {
            font-size: 24rpx;
            padding: 10rpx 20rpx;
            color: #fff;
            background-color: #EF730F;
            border-radius: 6rpx;
          }
        }

        .price_edit {
          margin-top: 30rpx;

          .edit_item {
            height: 80rpx;

            display: flex;
            align-items: center;
            // padding: 0 24rpx;
            border-bottom: 1rpx solid #b5b5b5;
            .product-img {
              width: 80rpx;
              height: 80rpx;
              .img {
                width: 80rpx;
                height: 80rpx;
              }
            }

            .item_info {
              display: flex;
              margin: 0 15rpx;

              input {
                width: 100rpx;
              }
            }

            .del_btn {
              min-width: 34rpx;
              height: 34rpx;
              line-height: 28rpx;
              border-radius: 50%;
              border: 1rpx solid #FF5449;
              text-align: center;
              color: #FF5449;
              position: relative;
              &::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 20rpx;
                height: 2rpx;
                background-color: #FF5449;
              }
            }
          }
        }
      }
    }

  }
</style>
