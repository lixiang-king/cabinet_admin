<template>
  <view class="page">
    <picker @change="bindPickerChange" :range-key="rangeKey" :range="range">
      <view class="uni-input">{{ range[index][rangeKey] }}</view>
    </picker>
  </view>

</template>

<script>
export default {
  props: {
    range: {
      type: Array,
      default () {
        return []
      }
    },
    rangeKey: {
      type: String,
      default: 'place'
    }
  },
  data () {
    return {
      index: 0
    }
  },
  methods: {
    bindPickerChange (e) {
      this.index = e.target.value
      this.$emit('pickOk', this.range[this.index])
    }
  }
}
</script>

<style lang="less">
</style>
