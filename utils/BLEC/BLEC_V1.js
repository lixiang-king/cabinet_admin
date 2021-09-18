import store from '@/store/store.js'
var discovery = false
var Data = {}
var batteryCount = 0
var zeroClearingValue = 'FE08010000000000000108'; // 清零
var noZeroClearingValue = 'FE08010000000000000007'; // 不清零
var test = 'FE08010000000000000108';
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

  toast(title) {
    wx.showToast({
        title: title,
        icon:'none',
        duration:1500,
        success(){
            setTimeout(()=>{
                wx.hideToast();
            },2000);

        }
    });
  },

  // 连接设备
  connectEvent(){
    if(store.state.connected){
        return;
    }
    // let deviceId = e.currentTarget.dataset.deviceid;
    // let services = e.currentTarget.dataset.services;
    // let services = [
    //     "49535343-FE7D-4AE5-8FA9-9FAFD205E455",
    //     "000018F0-0000-1000-8000-00805F9B34FB",
    //     "E7810A71-73AE-499D-8C15-FAA9AEF0C3F2",
    //     "0000180A-0000-1000-8000-00805F9B34FB"
    // ];
    // 停止搜寻附近的蓝牙外围设备
    this.stopDiscovery();

    // 断开与低功耗蓝牙设备的连接 然后再连接新的设备
    this.closeConnection();

    // 连接低功耗蓝牙设备
    // this.BLEConnection(deviceId);
    this.found()
},

  // 断开与低功耗蓝牙设备的连接
  closeConnection(){
    let connectingDeviceId = store.state.connectingDeviceId;
    if(!connectingDeviceId){
        return;
    }
    wx.closeBLEConnection({
        deviceId: connectingDeviceId,
        success(res){
            console.log('断开与低功耗蓝牙设备的连接');
            console.log(res);
        },
        fail(){
            toast('断开连接失败');
        }
    });
  },


  // 搜索蓝牙
  searchEvent(){
    let that = this;
    if (store.state.discovering){
        this.toast('正在搜索');
        return;
    }
    store.commit('setDeviceList', [])

    // 停止搜寻附近的蓝牙外围设备
    that.stopDiscovery();

    // 获取本机蓝牙适配器状态
    if(that.getBluetoothState()){
        return;
    }

    // 监听蓝牙适配器状态变化事件
    that.onBluetoothStateChange();

    // 开始搜寻附近的蓝牙外围设备
    that.startDiscovery();

    // 监听寻找到新设备
    that.onFoundBluetooth();
  },
  // 监听寻找到新设备的事件
  onFoundBluetooth(){
    let that = this;
    wx.onBluetoothDeviceFound(function (res) {
        // that.getDevices();
        // 兼容安卓及iOS设备
        if(res.deviceId){
            that.devicesData(res);
        } else if(res.devices){
            that.devicesData(res.devices[0]);
        } else if(res[0]){
            that.devicesData(res[0]);
        }
    });
  },
  devicesData(new_devices){
    let that = this;
    let deviceList = store.state.deviceList;
    let len = deviceList.length;
    let isExist = false;
    console.log(new_devices);
    if(!new_devices.name){
        new_devices.name = '空';
        return;
    }
    let advertisData = ab2hex(new_devices.advertisData);
    if(!advertisData){
        advertisData = '空';
    }
    new_devices.advertisData = advertisData;
    for(let i = 0; i < len; i++){
        if(new_devices.deviceId == deviceList[i].deviceId){
            isExist = true;
            deviceList.splice(i,1,new_devices);
        }
    }
    if(!isExist){
        deviceList.push(new_devices);
    }
   /*  that.setData({
        deviceList: deviceList
    }); */
    store.commit('setDeviceList', deviceList)
  },
  // 开始搜寻附近的蓝牙外围设备
  startDiscovery(){
    console.log('开始搜索设备');
    let that = this;
    wx.startBluetoothDevicesDiscovery({
        success (res) {
            /* that.setData({
                discovering:res.isDiscovering,
            }); */
            store.commit('setDiscovering', res.isDiscovering)
            // that.getDevices();
        },
        fail(){
            /* that.setData({
                discovering:false,
            }); */
            store.commit('setDiscovering', false)
            toast('搜索失败');
        }
    })
  },
  // 监听蓝牙适配器状态变化事件
  onBluetoothStateChange(){
    let that = this;
    wx.onBluetoothAdapterStateChange(function(res){
        console.log('监听蓝牙适配器状态变化');
        /* that.setData({
            available:res.available,
            discovering:res.discovering,
        }); */
        store.commit('setAvailable', res.available)
        store.commit('setDiscovering', res.discovering)
    });
  },

  // 获取本机蓝牙适配器状态
  getBluetoothState(){
    let that = this;
    wx.getBluetoothAdapterState({
      success(e){
          /* that.setData({
              available:e.available,
              discovering:e.discovering,
          }); */
          store.commit('setAvailable', e.available)
          store.commit('setDiscovering', e.discovering)
          return true;
      },
      fail(){
          /* that.setData({
              available:false,
              discovering:false,
          }); */
          store.commit('setAvailable', false)
          store.commit('setDiscovering', false)
          return false;
      }
    });
  },

  // 停止搜寻附近的蓝牙外围设备
  stopDiscovery(){
    let that = this;
    wx.stopBluetoothDevicesDiscovery({
        success(res){
            console.log('停止搜寻附近的蓝牙外围设备');
            console.log(res);
            /* that.setData({
                discovering:false
            }); */
            store.commit('setDiscovering', false)
        },
        fail(){
            toast('停止搜索失败');
        },
    });
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
			    resolve(res)
			  },
			  fail: (r) => {
			    uni.hideLoading()
			    reject(r)
			  }
			})
    })
  },
  /* openBluetoothAdapter() {
    this.closeBle()
    uni.openBluetoothAdapter({
      success: (res) => {
        console.log('初始化蓝牙适配器成功')
        this.state()
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
          state()
        }
      }
    })
  }, */

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
          this.connect()
        }
      }
    })
  },
  connect() {
    batteryCount = 0
    const { XDeviceId } = store.state
    wx.createBLEConnection({
      deviceId: XDeviceId,
      timeout: 60000,
      success: (res) => {
        // this.connectStatus = '连接成功'
        wx.getBLEDeviceServices({
          deviceId: XDeviceId,
          success: (res) => {
            let main = res.services.find((value) => {
              // return value.uuid == '0B49ABF0-C6FC-411D-8456-535AF817DAC8'
              return value.uuid == '0000180F-0000-1000-8000-00805F9B34FB'
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
    let deviceId = XDeviceId
    let servicesId = Data.serviceId
    //主服务
    wx.getBLEDeviceCharacteristics({
      deviceId: deviceId,
      serviceId: servicesId,
      success: (res) => {
       /*  Data.auth_characteristicId = '0B49ABF1-C6FC-411D-8456-535AF817DAC8'
        Data.operate_characteristicId = '0B49ABF2-C6FC-411D-8456-535AF817DAC8'
        Data.subscribe_characteristicId = '0B49ABF3-C6FC-411D-8456-535AF817DAC8'
        this.subscribe() */
        console.log('获取蓝牙设备characteristic');
        console.log(res);
        if(res.errCode == 0){
          let characteristics = res.characteristics;
          let len = characteristics.length;
          for(let k = 0; k < len; k++){
            let indicate = characteristics[k].properties.indicate;
            let notify = characteristics[k].properties.notify;
            let read = characteristics[k].properties.read;
            let write = characteristics[k].properties.write;
            console.log(servicesId+"------"+indicate,notify,read,write);
            if(write){
                console.log(servicesId+"$$$$$$$");
                console.log();
                // let connectingDeviceId = res.deviceId;
                let connectingDeviceId = deviceId;
                console.log('connectingDeviceId');
                console.log(connectingDeviceId);
                // let services_UUID = res.serviceId;
                let services_UUID = servicesId;
                console.log('services_UUID');
                console.log(services_UUID);
                let characteristic_UUID = characteristics[k].uuid;
                console.log('characteristic_UUID');
                console.log(characteristic_UUID);
                /* that.setData({
                    connectingDeviceId: connectingDeviceId,
                    services_UUID: services_UUID,
                    characteristic_UUID: characteristic_UUID
                }); */
                store.commit('setConnectingDeviceId', connectingDeviceId)
                store.commit('setServicesUUID', services_UUID)
                store.commit('setCharacteristicUUID', characteristic_UUID)
            }else if(notify){
                let connectingDeviceId = deviceId;
                let services_UUID = servicesId;
                let characteristic_UUID = characteristics[k].uuid;
                that.notifyValueChange(connectingDeviceId,services_UUID,characteristic_UUID);
            }
          }
        }
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
  // 启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值
  notifyValueChange(deviceId,services_UUID,characteristic_UUID){
    let that = this;
    wx.notifyBLECharacteristicValueChange({
        deviceId:deviceId,
        serviceId:services_UUID,
        characteristicId:characteristic_UUID,
        state:true,
        success(res){
            console.log('启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值: 成功---');
            console.log(res);

            that.onValueChange();

            setTimeout(function () {
                const { connectingDeviceId, services_UUID, characteristic_UUID } = store.state
                that.writeValue(connectingDeviceId,services_UUID,characteristic_UUID,test);
            },1000);

        },
        fail(res){
            console.log('启用低功耗蓝牙设备特征值变化时的 notify 功能，订阅特征值: 失败---');
            console.log(res);
        },
    });
  },
   // 发送
   sendValue(test) {
    const { connectingDeviceId, services_UUID, characteristic_UUID } = store.state
    this.writeValue(connectingDeviceId,services_UUID,characteristic_UUID,test);
  },

  // 向低功耗蓝牙设备特征值中写入二进制数据 建议每次写入不超过20字节
  writeValue(deviceId,services_UUID,characteristic_UUID,value){
    let that = this;
    that.writeToBluetoothValue(deviceId,services_UUID,characteristic_UUID,value);
  },

  // 蓝牙写数据
  writeToBluetoothValue(deviceId,services_UUID,characteristic_UUID,buffer){
      let value = this.hex2ab(test);
      wx.writeBLECharacteristicValue({
          deviceId:deviceId,
          serviceId:services_UUID,
          characteristicId:characteristic_UUID,
          value:value,
          success(res){
              console.log('向低功耗蓝牙设备特征值中写入二进制数据: 成功---');
              console.log(res);
          },
          fail(res){
              console.log('向低功耗蓝牙设备特征值中写入二进制数据: 失败---');
              console.log(res);
          }
      })
  },

   // 监听低功耗蓝牙设备的特征值变化
  // 必须先启用 notifyBLECharacteristicValueChange 接口才能接收到设备推送的 notification。
  onValueChange(){
    let that = this;
    wx.onBLECharacteristicValueChange(function(res){
        console.log('监听低功耗蓝牙设备的特征值变化');
        console.log(res);
        console.log(ab2hex(res.value));
        // 获取设备返回的数据
        let hex = ab2hex(res.value);
        // 获取总次数
        let num = hexSlice(hex);
        /* that.setData({
            shakeNum:num
        }); */
    });
  },

  // ArrayBuffer转16进度字符串示例
  ab2hex(buffer) {
    let hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2);
        }
    );
    return hexArr.join('');
  },
  hexSlice(hex) {
    // 取k8位
    let k8 = hex.slice(14,16);
    //取k9位
    let k9 = hex.slice(16,18);
    return parseInt(k9+k8,16);
  },
  hex2ab(str) {
    if (!str) {
        return new ArrayBuffer(0);
    }
    var val = "";
    for (var i = 0; i < str.length; i++) {
        val += str.charCodeAt(i).toString(16);
    }
    str = val;
    val = "";
    let length = str.length;
    let index = 0;
    let array = []
    while (index < length) {
        array.push(str.substring(index, index + 2));
        index = index + 2;
    }
    val = array.join(",");
    let typedArray = new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    }));
    let buffer1 = typedArray.buffer;
    console.log(buffer1);
    return buffer1;
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
