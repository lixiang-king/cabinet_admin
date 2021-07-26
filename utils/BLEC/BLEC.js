import store from '@/store/store.js'
var discovery = false
var Data = {}
var batteryCount = 0
import {
  httpOpElectric
} from '@/utils/request/api/operation.js'
const BLEC = {
  /**
   * 断开连接
   */
  closeBle() {
    // 关闭蓝牙
    uni.closeBluetoothAdapter({
      success(res) {
        console.log(res)
      }
    })
    // 清空store数据
    store.commit('setDeviceCode', '')
    store.commit('setDeviceId', '')
    store.commit('setDevInfo', {})
    store.commit('setBattery', 0)
    store.commit('setHexData', [])
    store.commit('setCntStatus', '未连接')
  },
  /**
   * 获取当前时间 --> 时分秒
   */
  getNowTime () {
    let dateTime
    let hh = new Date().getHours()
    let mf = new Date().getMinutes()
    let ss = new Date().getSeconds()
    dateTime = hh + ':' + mf + ':' + ss
    return dateTime
  },
  handleTimeFormat(time) {
    const timeArr = time.split(':')
    let timeStr = ''
    timeArr.forEach(item => {
      let num = Number(item).toString(16).padStart(2, '0')
      timeStr += num
    })
    return timeStr
  },
  /**
   * 蓝牙适配
   */
	openBluetoothAdapter() {
		return new Promise((resolve, reject) => {
			// 初始化蓝牙模块
			uni.openBluetoothAdapter({
				success: (res) => {
					console.log('初始化蓝牙适配器成功')
					uni.hideLoading()
					this.state()
					resolve(res)
				},
				fail: (res) => {
					console.log(res)
					if (res.errCode == 10001) {
					  uni.showModal({
					    title: '提示',
					    content: '蓝牙开关未开启',
					    success: function(res) {
					      if (res.confirm) {
					        console.log('用户点击确定');
					      } else if (res.cancel) {
					        console.log('用户点击取消');
					      }
					    }
					  });
					  this.state()
					}
					reject(r)
				}
			})
		})
	},

  state() {
    uni.onBluetoothAdapterStateChange((res) => {
      if (!res.available) {} else {
        this.bleChange()
      }
    })
  },

  bleChange() {
    uni.onBLEConnectionStateChange(async (res) => {
      console.log(`device ${res.deviceId}, connected: ${res.connected}`)
      if (res.connected) {
        store.commit('setCntStatus', '已连接')
      } else {
        store.commit('setCntStatus', '连接失败')
      }
    })
  },

  startBluetoothDevicesDiscovery(deviceId) {
    wx.startBluetoothDevicesDiscovery({
      services: ['0b49abf0-c6fc-411d-8456-535af817dac8', '0B49ABF0-C6FC-411D-8456-535AF817DAC8'],
      allowDuplicatesKey: deviceId == '' ? false : true,
      powerLevel: 'high',
      fail: (res) => {}
    })
  },
  
  bufToHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2)).join('')
  },
  
  hexToArrayBuffer(hex) {
    return new Uint8Array(
      hex.match(/[\da-f]{2}/gi).map((byte) => {
        return parseInt(byte, 16)
      })
    ).buffer
  },
  found() {
    store.commit('setCntStatus', '连接中')
    const { XDeviceCode, XDevCode, XDeviceId } = store.state
    discovery = true
    this.startBluetoothDevicesDiscovery(XDeviceId)
    uni.onBluetoothDeviceFound(async (res) => {
      if (discovery && res.devices[0].localName == XDevCode && res.devices[0].advertisData != '') {
        let dev = res.devices[0]
        console.log('找到设备', dev)
        if (dev.advertisData == undefined || dev.advertisData == null || dev.advertisData == '') {
          wx.stopBluetoothDevicesDiscovery()
          return found()
        } else {
          wx.stopBluetoothDevicesDiscovery()
          discovery = false
          store.commit('setDeviceId', dev.deviceId)
          this.getAPIData(this.bufToHex(dev.advertisData))
        }
      }
    })
  },
  async getAPIData(mf_data) {
    const { XDeviceCode, XBLECUrl, XBlecUserType } = store.state
    const params = {
      code: XDeviceCode,
      user_type: XBlecUserType,
      mf_data
    }
    this.handleRequest('/getHex', params)
      .then(res => {
        store.commit('setHexData', res.data)
        this.connect()
      })
      .catch(r => {
        uni.showToast({
          title: '获取Hex数据失败',
          icon: 'none'
        })
      })
  },
  connect() {
    batteryCount = 0
    const { XDeviceId } = store.state
    wx.createBLEConnection({
      deviceId: XDeviceId,
      timeout: 5000,
      success: (res) => {
        // this.connectStatus = '连接成功'
        wx.getBLEDeviceServices({
          deviceId: XDeviceId,
          success: (res) => {
            let main = res.services.find((value) => {
              return value.uuid == '0B49ABF0-C6FC-411D-8456-535AF817DAC8'
            })
            let battery = res.services.find((value) => {
              return value.uuid.slice(4, 8) == '180F'
            })
            Data.serviceId = main.uuid
            Data.battery_serviceId = battery.uuid
            this.characteristics()
          }
        })
      },
      fail: (res) => {
        if (res.errCode != -1) {
          this.connect()
        }
      }
    })
  },
  characteristics() {
    const { XDeviceId } = store.state
    //主服务
    wx.getBLEDeviceCharacteristics({
      deviceId: XDeviceId,
      serviceId: Data.serviceId,
      success: (res) => {
        Data.auth_characteristicId = '0B49ABF1-C6FC-411D-8456-535AF817DAC8'
        Data.operate_characteristicId = '0B49ABF2-C6FC-411D-8456-535AF817DAC8'
        Data.subscribe_characteristicId = '0B49ABF3-C6FC-411D-8456-535AF817DAC8'
        this.subscribe()
      }
    })
    //电量服务
    wx.getBLEDeviceCharacteristics({
      deviceId: XDeviceId,
      serviceId: Data.battery_serviceId,
      success: (res) => {
        let battery = res.characteristics.find((value) => {
          return value.uuid.slice(4, 8) == '2A19'
        })
        Data.battery_characteristicId = battery.uuid
        wx.notifyBLECharacteristicValueChange({
          deviceId: XDeviceId,
          serviceId: Data.battery_serviceId,
          characteristicId: Data.battery_characteristicId,
          state: true,
          success: (res) => {
            console.log('notify_battery_success', res)
          },
          fail: (res) => {
            console.log('notify_battery_fail', res)
          }
        })
      }
    })
  },
  async subscribe() {
    const { XDeviceId, XHexData } = store.state
    wx.notifyBLECharacteristicValueChange({
      deviceId: XDeviceId,
      serviceId: Data.serviceId,
      characteristicId: Data.subscribe_characteristicId,
      state: true,
      success: (res) => {
        wx.onBLECharacteristicValueChange(async (res) => {
          if (res.serviceId == Data.battery_serviceId) {
            this.handleBattery(parseInt(this.bufToHex(res.value), 16))
          } else if (res.serviceId == Data.serviceId) {
            let data = this.bufToHex(res.value)
            //返回值
            this.getFeedBack(data)
          }
        })
        //校验
        this.write(XHexData.auth, Data.auth_characteristicId)
        uni.hideLoading()
        store.commit('setCntStatus', '连接成功')
        this.setTime()
      },
      fail: (res) => {
        console.log('开启监听失败', res)
      }
    })
  },
  setTime () {
    const { XDeviceCode, XHexData } = store.state
    const time = this.getNowTime()
    const params = {
      code: XDeviceCode,
      time: this.handleTimeFormat(time)
    }
    this.handleRequest('/setTime', params)
    .then(res => {
      if (res.data.code === 200) {
        const hexVal = res.data.data
        this.write(hexVal)
      }
    })
    .catch(r => {
      uni.showToast({
        title: '获取时间指令失败',
        icon: 'none'
      })
    })
  },
  write(hex, cid) {
    const { XDeviceId } = store.state
    const buffer = this.hexToArrayBuffer(hex)
    return new Promise((resolve, reject) => {
      uni.writeBLECharacteristicValue({
        deviceId: XDeviceId,
        serviceId: Data.serviceId,
        characteristicId: cid ? cid : Data.operate_characteristicId,
        value: buffer,
        success(res) {
          console.log('写入成功')
          resolve(res)
        },
        fail(r) {
          reject(r)
        }
      })
    })
  },
  /**
   * @param {Number} battery 电量
   */
  handleBattery (battery) {
    if (batteryCount > 1) return
    batteryCount++
    console.log(battery, '电量')
    const { XDeviceCode } = store.state
    store.commit('setBattery', battery)
    // 发送电量
    const parmas = {
      machine_id: XDeviceCode,
      electric: battery
    }
    httpOpElectric(parmas).then(res => {})
  },
  async getFeedBack(hex) {
    const { XDeviceCode } = store.state
    const params = { code: XDeviceCode, hex }
    this.handleRequest('/feedback', params)
    .then(res => {
      console.log(res.data, 'feedback')
    })
    .catch(r => {
      // uni.showToast({
      //   title: '获取反馈失败',
      //   icon: 'none'
      // })
    })
  },
  handleRequest(url, data) {
    const { XBLECUrl } = store.state
    return new Promise((resolve, reject) => {
      uni.request({
        url: XBLECUrl + url,
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        data,
        success: (res) => {
          resolve(res.data)
        },
        fail: (r) => {
          reject(r)
        }
      })
    })
  }

}
export default BLEC
