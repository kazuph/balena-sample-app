// nobleは本家ではなくメンテが続いているabandonwareさんのものを利用する
const noble = require('@abandonware/noble');

// Rxを使う意味は今回はないが慣れると便利なので利用する
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

// BLEが利用可能になったことを通知するイベント
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

// BLEデバイスが発見された時のイベント
const bleDevices = fromEvent(noble, 'discover');

const startScanInterval = () => {
  console.log('[ble]start scan');
  noble.startScanning([]);
  // 15秒間スキャンして検出数を表示する
  interval(15 * 1000).subscribe(() => {
    noble.stopScanning();
    console.log("BLE Count: " + count);

    noble.startScanning([]);
    count = 0;
  });
};

let count = 0;

forkJoin({
  ble: blePowerdOn
}).pipe(
  mergeMap(() => {
    startScanInterval();
    return bleDevices;
  }),
).subscribe((peripheral) => {
  console.log([peripheral.address]);
  count++;
});
