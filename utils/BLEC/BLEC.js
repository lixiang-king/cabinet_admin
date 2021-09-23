//待做 判断connectedDeviceId的入口

import store from '@/store/store.js'
var discovery = false
var Data = {}
var batteryCount = 0
import {
  httpOpElectric
} from '@/utils/request/api/operation.js'
const BLEC = {
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
  write(hex) {
    const buffer = this.hexToArrayBuffer(hex)
    return new Promise((resolve, reject) => {
      uni.writeBLECharacteristicValue({
        deviceId: store.state.connectedDeviceId,
        serviceId: Data.battery_serviceId,
        characteristicId: Data.battery_characteristicId,
        // serviceId: store.state.writeServicweId,
        // characteristicId: store.state.writeCharacteristicsId,
        value: buffer,
        success(res) {
          console.log('写入成功')
          console.log(res);
          resolve(res)
        },
        fail(r) {
          reject(r)
        }
      })
    })
  },
  hexToArrayBuffer(hex) {
    return new Uint8Array(
      hex.match(/[\da-f]{2}/gi).map((byte) => {
        return parseInt(byte, 16)
      })
    ).buffer
  },
	//启动蓝牙 （初始化蓝牙模块-->获取本机蓝牙适配器状态-->开始搜寻附近的蓝牙外围设备-->监听寻找到新设备的事件）
  startBluetooth: function () {
    var that = this;
    // that.setData({status: "初始化蓝牙模块"})
    store.commit('setCntStatus', '连接中')
    store.commit('setStatus', "初始化蓝牙模块")
    //初始化蓝牙模块
    uni.openBluetoothAdapter({
      success(res) {
        //获取本机蓝牙适配器状态
        uni.getBluetoothAdapterState({
          success(res) {
            console.log('获取本机蓝牙适配器状态', res)
            //蓝牙适配器是否可用
            if (res.available) {
                //是否正在搜索设备
                if (res.discovering) {
                    //监听寻找到新设备的事件
                    that.onBluetoothDeviceFound()
                } else {
                    //开始搜寻附近的蓝牙外围设备
                    wx.startBluetoothDevicesDiscovery({
                        allowDuplicatesKey: true, //允许重复上报同一设备,更新RSSI值
                        success(res) {
                            that.onBluetoothDeviceFound()
                        },
                        fail(res) {
                           /*  that.setData({
                                status: '搜寻失败：'+res.errCode
                            }) */
                            store.commit('setStatus', '搜寻失败：'+res.errCode)
                            wx.showModal({
                                title: '搜寻失败',
                                content: "错误信息:"+res.errCode+" 错误编码:"+res.errCode,
                                showCancel: false
                            })
                        }
                    })
                }
            } else {
                // that.setData({status: "蓝牙适配器不可用"})
                store.commit('setStatus', "蓝牙适配器不可用")
                wx.showModal({
                    title: '手机未开启蓝牙',
                    content: "错误信息:"+res.errCode+" 错误编码:"+res.errCode,
                    showCancel: false
                })
            }
          }
        })
      },
      fail(res) {
        //console.log('fail',res)
        // that.setData({status: "初始化失败："+res.errCode}) //res.errMsg})
        store.commit('setStatus', "初始化失败："+res.errCode)
        wx.showModal({
            title: '手机未开启蓝牙',
            content: "错误信息:"+res.errCode+" 错误编码:"+res.errCode,
            showCancel: false
        })
      }
    })
  },
  //监听寻找新设备
  onBluetoothDeviceFound() {
    let that = this
    // that.setData({status: "搜寻中......"})
    store.commit('setStatus', "搜寻中......")
    wx.onBluetoothDeviceFound(function (res) {
      console.log('监听到的设备',res);
      res.devices.forEach(device => {
          console.log('监听到的设备名称：',device.name);
          if(device.name==store.state.deviceName){
              that.connectTO(device.deviceId);
          }
          const foundDevices = store.state.devicesList
          const idx = that.inArray(foundDevices, 'deviceId', device.deviceId)
          const data = {}
          if (idx === -1) {
              data[`devicesList[${foundDevices.length}]`] = device
          } else {
              data[`devicesList[${idx}]`] = device
          }
          // that.setData(data)
          store.commit('setData', data)
          //是否有已连接设备
          wx.getConnectedBluetoothDevices({//根据 uuid 获取处于已连接状态的设备
              services:device.advertisServiceUUIDs,
              success: function (res) {
                  console.log('已连接的蓝牙设备:',res)
                  console.log(JSON.stringify(res.devices));
                  /*  that.setData({
                      connectedDeviceId: res.deviceId
                  }) */
                store.commit('setConnectedDeviceId', res.deviceId)
              }
          })
      })
    })
  },

  //连接设备  
  connectTO: function (deviceId) {
    var that = this;
    /* that.setData({
        status: "停止搜索"
    }) */
    store.commit('setStatus', "停止搜索")
    wx.stopBluetoothDevicesDiscovery({ //先停止搜索周边设备
        success: function (res) {
          console.log('连接设备前，先停止搜寻附近的蓝牙外围设备',res)
        }
    })
    wx.offBluetoothDeviceFound({ //先停止搜索周边设备
        success: function (res) {
          console.log('取消监听寻找到新设备的事件',res)
        }
    })

    wx.showLoading({title: '连接蓝牙设备中...',})
    wx.createBLEConnection({//若小程序在之前已有搜索过某个蓝牙设备，并成功建立链接，可直接传入之前搜索获取的deviceId直接尝试连接该设备，无需进行搜索操作。
        deviceId:deviceId,
        success: function (res) {
          console.log('连接成功:',res)
          /* that.setData({
              //currentTarget: 事件绑定的元素
              connectedDeviceId: deviceId   
              ,status: "已连接",
          }) */
          store.commit('setConnectedDeviceId', deviceId)
          store.commit('setStatus', "已连接")
          that.getServices();
          setTimeout(function () {
          that.notifyMachineid();
          }, 3000)
        },
		
        fail: function () {
            console.log("连接失败");
        },
        complete: function () {
            wx.hideLoading();
            console.log('已连接设备ID：' + store.state.connectedDeviceId);
            console.log("调用结束");
        }
    })
  },

  //验证设备id
  notifyMachineid: function () {
    var that = this;
    let buffer = new ArrayBuffer(17);
    let dataView = new DataView(buffer);
    dataView.setUint8(0, parseInt(208,10));
    dataView.setUint8(1, parseInt(17,10));
    dataView.setUint8(2, parseInt(3,10));
    // dataView.setUint8(3,'2');
    // dataView.setUint8(4,'A');
    // dataView.setUint8(5,'E');
    // dataView.setUint8(6,'4');
    // dataView.setUint8(7,'E');
    // dataView.setUint8(8,'7');
    // dataView.setUint8(9,'8');
    // dataView.setUint8(10,'1');
    // dataView.setUint8(11,'8');
    // dataView.setUint8(12,'C');
    // dataView.setUint8(13,'8');
    // dataView.setUint8(14,'3');

    dataView.setUint8(3,parseInt(2,10));
    dataView.setUint8(4,parseInt(10,10));
    dataView.setUint8(5,parseInt(14,10));
    dataView.setUint8(6,parseInt(4,10));
    dataView.setUint8(7,parseInt(14,10));
    dataView.setUint8(8,parseInt(7,10));
    dataView.setUint8(9,parseInt(8,10));
    dataView.setUint8(10,parseInt(1,10));
    dataView.setUint8(11,parseInt(8,10));
    dataView.setUint8(12,parseInt(12,10));
    dataView.setUint8(13,parseInt(8,10));
    dataView.setUint8(14,parseInt(3,10));
    
    dataView.setUint8(15,parseInt(0,10));
    var sum = this.USART_CheckProc(new Uint8Array(buffer));
    // console.log(123456);
    //校验位
    dataView.setUint8(16, parseInt(sum,16));
    // console.log(buffer);
    that.sendDataView(buffer);
    
  },



  //获取已连接设备服务
  getServices: function () {
    var that = this;
    wx.getBLEDeviceServices({//获取在小程序蓝牙模块生效期间所有已发现的蓝牙设备，包括已经和本机处于连接状态的设备
        // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
        deviceId: store.state.connectedDeviceId,
        success: function (res) {
            console.log('获取蓝牙设备所有服务成功：', res);
            // store.state.services = res.services
            store.commit('setServices', res.services)
            console.log('获取蓝牙设备所有服务成功：', store.state.services);
           /*  that.setData({
                serviceId: store.state.services[1].uuid
            }) */
            store.commit('setServiceId', store.state.services[1].uuid)
            console.log("服务uuid:", store.state.serviceId)
            let battery = res.services.find((value) => {
              return value.uuid.slice(4, 8) == '180F'
            })
            Data.battery_serviceId = battery.uuid
            //获取蓝牙设备某个服务中所有特征值(characteristic)。
            wx.getBLEDeviceCharacteristics({
                // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
                deviceId: store.state.connectedDeviceId,
                // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
                serviceId: store.state.serviceId,   //-----注意是store.state.services[0].uuid
                success: function (res) {
                    console.log('获取所有uuid:',res)
                    
                    var _suuid  = store.state.services[1].uuid; // 服务uuid
                    console.log('设备服务uuid:', _suuid)
                    for (var i = 0; i < res.characteristics.length; i++) {
                        var _tuuid  = res.characteristics[i].uuid; //通道uuid
                        var _notify = res.characteristics[i].properties.notify;
                        var _write  = res.characteristics[i].properties.write;
                        var _read   = res.characteristics[i].properties.read;
                        //空中配置 FFF1 {notify: true, write: false, indicate: false, read: true}
                        if (_notify&&_write&&_read) {   //注意characteristic(特征值)信息,properties对象
                           /*  that.setData({
                                configServicweId: _suuid,
                                configCharacteristicsId: _tuuid,
                            }) */
                            store.commit('setconfigServicweId', _suuid)
                            store.commit('setconfigCharacteristicsId', _tuuid)
                            console.log("空中配置通道uuid", _tuuid)
                        }
                        //手机-->设备 写数据 FFF2 {notify: false, write: true, indicate: false, read: true}
                        else if (_notify==false&&_write) {
                            /* that.setData({
                                writeServicweId: _suuid,
                                writeCharacteristicsId: _tuuid,
                            }) */
                            store.commit('setwriteServicweId', _suuid)
                            store.commit('setwriteCharacteristicsId', _tuuid)
                            console.log("发数据通道uuid", _tuuid)
                        //设备-->手机 收数据 FFF3 {notify: true, write: true, indicate: false, read: true}
                        } else if (_notify) {
                            /* that.setData({
                                readServicweId: _suuid,
                                readCharacteristicsId: _tuuid,
                            }) */
                            store.commit('setreadServicweId', _suuid)
                            store.commit('setreadCharacteristicsId', _tuuid)
                            console.log("收数据通道uuid", _tuuid)
                        }
                    }
                    // 启动监听低功耗蓝牙设备的特征值变化事件
                    that.startBletNotify();
                    // that.subscribe()
                },
                fail: function () {
                    console.log("获取连接设备的所有特征值：", res);
                },
                complete: function () {
                    console.log("complete!");
                }
            })
            //电量服务
            wx.getBLEDeviceCharacteristics({
              deviceId: store.state.connectedDeviceId,
              serviceId: Data.battery_serviceId,
              success: (res) => {
                console.log("电量服务======》》》》》");
                console.log(res);
                let battery = res.characteristics.find((value) => {
                  return value.uuid.slice(4, 8) == '2A19'
                })
                Data.battery_characteristicId = battery.uuid
                wx.notifyBLECharacteristicValueChange({
                  deviceId: store.state.connectedDeviceId,
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
        }
    })
  },
  //启用监听
  startBletNotify: function () {
    var that = this;
    console.log("启用监听======》");
    console.log(store.state.connectedDeviceId);
    console.log(store.state.readServicweId);
    console.log(store.state.readCharacteristicsId);
    wx.notifyBLECharacteristicValueChange({
        state: true, // 启用监听 notify
        deviceId: store.state.connectedDeviceId,
        serviceId: store.state.readServicweId,
        characteristicId: store.state.readCharacteristicsId,
        success: function (res) {
            wx.showToast({title: '启用蓝牙监听'});
            console.log('启用蓝牙监听：', res);
            wx.onBLECharacteristicValueChange(async (res) => {
              console.log("onBLECharacter2132312======>");
              console.log(res);
              console.log(res.serviceId == store.state.writeServicweId);
              if (res.serviceId == store.state.writeServicweId) {
                console.log('监听接收数据：', res);
                console.log(that.bufToHex(res.value));
                that.handleBattery(parseInt(that.bufToHex(res.value), 16))
                /* let hexStr = that.ab2hex(res.value)
                that.handleBattery(parseInt(hexStr, 16))
                console.log('接收数据(十六进制)：', hexStr);
                hexStr = that.hexCharCodeToStr(hexStr);
                console.log('接收数据(十六进制转ASCII)：', hexStr);
                wx.showToast({
                  title: hexStr,
                  icon:'none'
                }) */
              }
            })
            //通知远程服务器蓝牙就绪
            /*
            wx.request({
                url: 'http://www.xxxx.com/test1.php', //仅为示例，并非真实的接口地址
                data: {x: '',y: ''},
                header: {'content-type': 'application/json' // 默认值},
                success (res) {
                  console.log(res.data)
                }
            })
            */
            store.commit('setCntStatus', '连接成功')
        },
        fail: function (res) {
            store.commit('setCntStatus', '连接失败')
            wx.showToast({
                title: '启用蓝牙监听功能失败！',
                icon: 'none'
              })
            console.log('启用蓝牙监听功能失败！', res);
        },
        complete: function(){
            console.log('监听设备ID：', store.state.connectedDeviceId)
            console.log('监听服务uuid：', store.state.readServicweId)
            console.log('监听通道uuid：', store.state.readCharacteristicsId)
        }
    })
  },

  //断开连接  
  closeBluetooth: function () {
    var that = this;
    wx.closeBLEConnection({
        deviceId: store.state.connectedDeviceId,
        success: function (res) {
            console.log('断开设备连接: ', store.state.connectedDeviceId)
            console.log(res)
            /* that.setData({
                connectedDeviceId: '',    //currentTarget: 事件绑定的元素
                status: "已断开连接",
            }) */
            store.commit('setStatus', '已断开连接')
            store.commit('setConnectedDeviceId', '')
            // 清空store数据
            store.commit('setDeviceCode', '')
            store.commit('setDeviceId', '')
            store.commit('setDevInfo', {})
            store.commit('setBattery', 0)
            store.commit('setHexData', [])
            store.commit('setCntStatus', '未连接')
        }
    })
  },

  inArray(arr, key, val) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i][key] === val) {
            return i;
        }
    }
    return -1;
  },
  /* 出货设置 */
  navTo1(index) {
    let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      var that = this
      // var order="9999999999999999999999";
      let buffer = new ArrayBuffer(17);
      let dataView = new DataView(buffer);
      dataView.setUint8(0, parseInt(208,10));
      dataView.setUint8(1, parseInt(17,10));
      dataView.setUint8(2, parseInt(1,10));
      dataView.setUint8(3, parseInt(1,10));
      dataView.setUint8(4, parseInt(index+1,10));
    dataView.setUint8(5, parseInt(hh,16));
    dataView.setUint8(6, parseInt(mf,16));
    dataView.setUint8(7, parseInt(ss,16));
    dataView.setUint8(8, parseInt(4,10));
    dataView.setUint8(9, parseInt(1,10));
    dataView.setUint8(10, parseInt(1,10));
    dataView.setUint8(11, parseInt(1,10));
    dataView.setUint8(12, parseInt(1,10));
    dataView.setUint8(13, parseInt(1,10));
    dataView.setUint8(14, parseInt(1,10));
    dataView.setUint8(15, parseInt(0,10));
      var sum = this.USART_CheckProc(new Uint8Array(buffer));
      // console.log(sum);
      //校验位
      dataView.setUint8(16, parseInt(sum,16));
      // console.log(buffer);
      that.sendDataView(buffer);
  }, 

  /* 灯光设置：中间灯设置 */
  navTo(index, start=[], end=[]) {
    let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
    var that = this
    var order="9999999999999999999999";
    let buffer = new ArrayBuffer(16);
    let dataView = new DataView(buffer);
    dataView.setUint8(0, parseInt(208,10));
    dataView.setUint8(1, parseInt(16,10));
    dataView.setUint8(2, parseInt(2,10));//led设置：2
    dataView.setUint8(3, parseInt(1,10));//1 中间灯 ；2 仓位环灯；3 外圈跑马灯
    dataView.setUint8(4, parseInt(index,10));//LED 子命令：0 关 ；1 开 ；外圈跑马灯灯带控制指令
    dataView.setUint8(5, parseInt(hh,16)); // 校验时间： 时
    dataView.setUint8(6, parseInt(mf,16)); // 校验时间： 分
    dataView.setUint8(7, parseInt(ss,16)); // 校验时间： 秒
    dataView.setUint8(8, parseInt(start[0] ? start[0] : 0,16));//开始时间：时
    dataView.setUint8(9, parseInt(start[1] ? start[1] : 0,16));//开始时间：分
    dataView.setUint8(10, parseInt(0,16));//开始时间：秒 17为11
    dataView.setUint8(11, parseInt(end[0] ? end[0] : 0,16));//结束时间:时
    dataView.setUint8(12, parseInt(end[1] ? end[1] : 0,16));//结束时间:分
    dataView.setUint8(13, parseInt(0,16));//结束时间:秒 48为30
    dataView.setUint8(14, parseInt(0,10));//备用
    var sum = this.USART_CheckProc(new Uint8Array(buffer));
    console.log(sum);
    //校验位
    dataView.setUint8(15, parseInt(sum,16));
    console.log(buffer);
    that.sendDataView(buffer);
  }, 

  /* 灯光设置：跑马灯时间设置 */
  navTo2(index, start=[], end=[]) {
    let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      var that = this
      var order="9999999999999999999999";
      let buffer = new ArrayBuffer(16);
      let dataView = new DataView(buffer);
      dataView.setUint8(0, parseInt(208,10));
      dataView.setUint8(1, parseInt(16,10));
      dataView.setUint8(2, parseInt(2,10));//led设置：2
      dataView.setUint8(3, parseInt(3,10));//1 中间灯 ；2 仓位环灯；3 外圈跑马灯
      dataView.setUint8(4, parseInt(index,10));//LED 子命令：0 关 ；1 开 ；外圈跑马灯灯带控制指令
      dataView.setUint8(5, parseInt(hh,16));
      dataView.setUint8(6, parseInt(mf,16));
      dataView.setUint8(7, parseInt(ss,16));
      dataView.setUint8(8, parseInt(start[0] ? start[0] : 0,16));//开始时间：时
      dataView.setUint8(9, parseInt(start[1] ? start[1] : 0,16));//开始时间：分
      dataView.setUint8(10, parseInt(0,16));//开始时间：秒 17为11
      dataView.setUint8(11, parseInt(end[0] ? end[0] : 0,16));//结束时间:时
      dataView.setUint8(12, parseInt(end[1] ? end[1] : 0,16));//结束时间:分
      dataView.setUint8(13, parseInt(0,16));//结束时间:秒 48为30
      dataView.setUint8(14, parseInt(0,10));//备用
        
      var sum = this.USART_CheckProc(new Uint8Array(buffer));
        console.log(sum);
        //校验位
        dataView.setUint8(15, parseInt(sum,16));
        console.log(buffer);
        that.sendDataView(buffer);
  }, 
    /* 灯光设置：跑马灯调试 */
  navTo3(index) {
      let hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      var that = this
      var order="9999999999999999999999";
      let buffer = new ArrayBuffer(16);
      let dataView = new DataView(buffer);
      dataView.setUint8(0, parseInt(208,10));
      dataView.setUint8(1, parseInt(16,10));
      dataView.setUint8(2, parseInt(2,10));//led设置：2
      dataView.setUint8(3, parseInt(3,10));//1 中间灯 ；2 仓位环灯；3 外圈跑马灯
      dataView.setUint8(4, parseInt(index,10));//LED 子命令：0 关 ；1 开 ；外圈跑马灯灯带控制指令
      dataView.setUint8(5, parseInt(hh,16)); // 校验时间： 时
      dataView.setUint8(6, parseInt(mf,16)); // 校验时间： 分
      dataView.setUint8(7, parseInt(ss,16)); // 校验时间： 秒
      dataView.setUint8(8, parseInt(0,10));//开始时间：时
      dataView.setUint8(9, parseInt(0,10));//开始时间：分
      dataView.setUint8(10, parseInt(0,10));//开始时间：秒
      dataView.setUint8(11, parseInt(0,10));//结束时间:时
      dataView.setUint8(12, parseInt(0,10));//结束时间:分
      dataView.setUint8(13, parseInt(0,10));//结束时间:秒
              
      var sum = this.USART_CheckProc(new Uint8Array(buffer));
      console.log(sum);
      //校验位
      dataView.setUint8(15, parseInt(sum,16));
      console.log(buffer);
      that.sendDataView(buffer);
  }, 

  getNowTime () {
    let dateTime
    let hh = new Date().getHours()
    let mf = new Date().getMinutes()
    let ss = new Date().getSeconds()
    dateTime = hh + ':' + mf + ':' + ss
    return dateTime
  },
  handleTimeFormat(time) {
    console.log(time);
    const timeArr = time.split(':')
    /* let timeStr = ''
    timeArr.forEach(item => {
      let num = Number(item).toString(16).padStart(2, '0')
      timeStr += num
    }) */
    return timeArr
  },
	
  //包数据校验
  USART_CheckProc(dataView){
    var arr = [];
    for(var i=0;i<dataView.length;i++){
        arr.push(dataView[i]);
    }
    var str = this.sum(arr).toString(16).toUpperCase();
      return str.substring(str.length-2);
  },
  sum(arr) {
      var s = 0;
      arr.forEach(function(val, idx, arr) {
          s += val;
      }, 0);  
      return s;
  },

  sendDataView(buffer) {
    // var that = this
    // that.getMessagesData();
    wx.writeBLECharacteristicValue({
        deviceId: store.state.connectedDeviceId,
        serviceId: store.state.writeServicweId,
        characteristicId: store.state.writeCharacteristicsId,
        value: buffer,
        success: function (res) {
            console.log('设备ID：', store.state.connectedDeviceId)
            console.log('写服务uuid:', store.state.writeServicweId)
            console.log('写通道uuid:', store.state.writeCharacteristicsId)
            console.log('发送成功：', res)
        }
    })
  },
  
  //接收设备推送数据
  getMessagesData: function() {
      var that = this;
      // 这里的回调可以获取到 write 导致的特征值改变  
      wx.onBLECharacteristicValueChange(function (res) {
        console.log("======getMessagesData=======");
        console.log(res);
        console.log(res.serviceId);
        console.log(store.state.writeServicweId);
        console.log(res.serviceId == store.state.writeServicweId);
        if (res.serviceId == store.state.writeServicweId) {
          console.log('监听接收数据：', res);
          let hexStr = that.ab2hex(res.value)
          that.handleBattery(parseInt(hexStr, 16))
          console.log('接收数据(十六进制)：', hexStr);
          hexStr = that.hexCharCodeToStr(hexStr);
          console.log('接收数据(十六进制转ASCII)：', hexStr);
          // that.setData({getData: hexStr})
          wx.showToast({
            title: hexStr,
            icon:'none'
          })
        }
          
      })
  },

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
  

  //将字符串转换成ArrayBufer
  string2buffer(str) {
    if (!str) return;
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
    // 将16进制转化为ArrayBuffer
    return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
        return parseInt(h, 16)
    })).buffer
  },
  ab2hex(buffer) {
    let hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function (bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join('');
  },

  bufToHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), (x) => ('00' + x.toString(16)).slice(-2)).join('')
  },
  hexCharCodeToStr(hexCharCodeStr) {
    var trimedStr = hexCharCodeStr.trim();
    var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x" ?
    trimedStr.substr(2) :
    trimedStr;
    var len = rawStr.length;
    if (len % 2 !== 0) {
        alert("Illegal Format ASCII Code!");
        return "";
    }
    var curCharCode;
    var resultStr = [];
    for (var i = 0; i < len; i = i + 2) {
        curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
        resultStr.push(String.fromCharCode(curCharCode));
    }
    return resultStr.join("");
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
