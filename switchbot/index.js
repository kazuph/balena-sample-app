const noble = require('@abandonware/noble');
const SWITCHBOT_SERVICE_UUID = "cba20d00224d11e69fb80002a5d5c51b";

const {
  fromEvent,
  forkJoin,
  interval,
} = require('rxjs');

const {
  filter,
  map,
  mergeMap,
  take,
} = require('rxjs/operators');

const blePowerdOn = fromEvent(
  noble,
  'stateChange'
).pipe(
  filter((state) => {
    console.log(state);
    return state === 'poweredOn';
  }),
  map(() => console.log('[ble]poweredOn')),
  take(1)
);

const bleDevices = fromEvent(noble, 'discover');

const startScanInterval = () => {
  console.log('[ble]start scan');
  noble.startScanning([SWITCHBOT_SERVICE_UUID]);
  // 15秒間スキャンしなおす
  interval(15 * 1000).subscribe(() => {
    noble.stopScanning();
    noble.startScanning([SWITCHBOT_SERVICE_UUID]);
  });
};

const decodeSensorData = (data) => {
  try {
    const batt = data[2] & 0b01111111;
    const isTemperatureAboveFreezing = data[4] & 0b10000000;
    let temp = (data[3] & 0b00001111) / 10 + (data[4] & 0b01111111);
    if (isTemperatureAboveFreezing < 0) temp = -temp;
    const humid = data[5] & 0b01111111;
    return {
      '温度': temp,
      '湿度': humid,
      '電池残量': batt
    };
  } catch (error) {
    console.log(error);
    return "ERROR";
  }
};

forkJoin({
  ble: blePowerdOn
}).pipe(
  mergeMap(() => {
    console.log('[ble]scanning...');
    noble.startScanning([]);
    startScanInterval();
    return bleDevices;
  }),
).subscribe((peripheral) => {
  console.log(decodeSensorData(peripheral.advertisement.serviceData[0].data));
});
