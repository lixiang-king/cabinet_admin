<template>
  <view class="add_page">
    <view class="header"></view>
    <view class="edit_form">
      <view class="page_title">
        <view class="p_title">商品{{ typeName }}</view>
      </view>
      <view class="form_item">
        <view class="label"><text>商品编号</text></view>
        <input class="value" type="text" v-model="formInfo.goods_id" placeholder="商品编号" />
      </view>
      <view class="form_item">
        <view class="label"><text>商品名称</text></view>
        <input class="value" type="text" v-model="formInfo.goods_name" placeholder="商品名称" />
      </view>
      <view class="form_item">
        <view class="label"><text>商品分类</text></view>
        <input class="value" type="text" v-model="formInfo.goods_type" placeholder="商品分类" />
      </view>
      <view class="form_item">
        <view class="label"><text>{{ typeName }}数量</text></view>
        <input class="value" type="text" v-model="formInfo.sum" :placeholder="'请输入' + typeName + '数量'" />
      </view>
      <view class="form_item">
        <view class="label"><text>{{ typeName }}类型</text></view>
        <view class="value type_pick">
          <picker @change="onTypeChange" :value="typeIndex" :range="stock_type">
            <view class="uni-input">{{ formInfo.putType }}</view>
          </picker>
        </view>
      </view>
      <view class="form_item">
        <view class="label"><text>备注信息</text></view>
        <input class="value" type="text" v-model="formInfo.remarks" placeholder="请输入备注" />
      </view>
    </view>
    <view class="bottom_btn" @click="onSubmit">
      提交
    </view>
  </view>
</template>

<script>
  import {
    mapState
  } from 'vuex'
  import {
    httpStockGoodsInfo,
    httpStockIn,
    httpStockOut
  } from '@/utils/request/api/stock.js'
  export default {
    computed: {
      ...mapState(['XChannelId']),
      typeName() {
        if (this.type === 1) {
          return '入库'
        } else {
          return '出库'
        }
      }
    },
    data() {
      return {
        formInfo: {},
        stock_type: [],
        typeIndex: 0,
        type: 1,
        goodsId: ''
      }
    },
    methods: {
      onTypeChange(e) {
        this.typeIndex = e.target.value
        this.formInfo.putType = this.stock_type[this.typeIndex]
      },
      handleFormCheck(params) {
        const paramsRules = [{
            name: 'goods_id',
            required: true,
            type: 'required',
            errmsg: '请输入商品编号'
          },
          {
            name: 'goods_name',
            required: true,
            type: 'required',
            errmsg: '请输入商品名称'
          },
          {
            name: 'goods_type',
            required: true,
            type: 'required',
            errmsg: '请输入商品分类'
          },
          {
            name: 'sum',
            required: true,
            type: 'required',
            errmsg: '请输入' + this.typeName + '数量'
          }, {
            name: 'putType',
            required: true,
            type: 'required',
            errmsg: '请选择' + this.typeName + '类型'
          }, {
            name: 'remarks',
            required: true,
            type: 'required',
            errmsg: '请输入备注'
          }
        ]
        const regRes = this.$validate.validate(params, paramsRules)
        if (!regRes.isOk) {
          uni.showToast({
            title: regRes.errmsg,
            icon: 'none'
          })
          return false
        } else {
          return true
        }
      },
      onSubmit() {
        const regRes = this.handleFormCheck(this.formInfo)
        if (!regRes) return
        const {
          goods_id,
          goods_name,
          goods_type,
          channel_id,
          remarks
        } = this.formInfo
        const params = {
          goods_id,
          goods_name,
          goods_type,
          channel_id,
          remarks
        }
        if (this.type === 1) {
          params.stock_in_sum = this.formInfo.sum
          params.stock_in_type = this.stock_type[this.typeIndex]
          this.handleStockIn(params)
        } else {
          params.stock_out_sum = this.formInfo.sum
          params.stock_out_type = this.stock_type[this.typeIndex]
          this.handleStockOut(params)
        }
      },
      handleStockIn(params) {
        httpStockIn(params).then(res => {
          uni.showToast({
            title: '入库成功'
          })
          uni.navigateBack({
            delta: 1
          })
        })
      },
      handleStockOut(params) {
        httpStockOut(params).then(res => {
          uni.showToast({
            title: '出库成功'
          })
          uni.navigateBack({
            delta: 1
          })
        })
      },
      async getPutInfo() {
        const params = {
          channel_id: this.XChannelId,
          goods_id: this.goodsId,
          type: this.type
        }
        const { msg } = await httpStockGoodsInfo(params)
        this.formInfo = msg.goods_info
        this.stock_type = msg.goods_info.stock_type
        this.formInfo.putType = this.stock_type[this.typeIndex]
      }
    },
    onLoad(option) {
      const type = Number(option.type)
      this.goodsId = option.goodsId
      this.type = type
      uni.setNavigationBarTitle({
        title: this.typeName
      })
      this.getPutInfo()
    }
  }
</script>

<style lang="less" scoped>
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

    .edit_form {
      padding: 0rpx 10rpx;
      position: absolute;
      top: 30rpx;
      left: 50%;
      transform: translateX(-50%);
      width: 710rpx;
      z-index: 2;
      background-color: #ffffff;
      border-radius: 6rpx;

      .page_title {
        margin: 20rpx 0;
        font-weight: bold;
      }

      .form_item {
        height: 80rpx;
        display: flex;
        align-items: center;
        padding: 0 20rpx;
        border-bottom: 1rpx solid #b5b5b5;

        &:nth-last-of-type(1) {
          border-bottom: none;
        }

        .label {
          width: 160rpx;
          text-align: left;
          font-size: 30rpx;
          margin-right: 60rpx;
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

        .value {
          width: 500rpx;
        }
      }
    }
  }
</style>
