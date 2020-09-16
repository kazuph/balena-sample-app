const RaspiCam = require("raspicam");
const fs = require('fs');
const handler = require('serve-handler');
const http = require('http');

const moment = require('moment-timezone');
moment.tz.setDefault("Asia/Tokyo");

// 環境変数を利用してbalenaのWebコンソールから値の変更をできるようにする
const rotation = process.env.CAMERA_ROTATION || 180;
const width = process.env.CAMERA_WIDTH || 1280;
const height = process.env.CAMERA_HEIGHT || 960;
const start = process.env.CAMERA_START_HOUR || 7;
const end = process.env.CAMERA_END_HOUR || 19;
const intervalSec = process.env.CAMERA_INTERVAL || 10; // [sec]

// ファイルサーバー構築
const server = http.createServer((request, response) => {
	return handler(request, response, {
		'public': '/data',
		'renderSingle': 'true'
	});
});
server.listen(3000, () => {
	console.log('Server running on port 3000');
});

// 以下、撮影のための記述
function takePhoto() {
	const savePath = "/data/" + moment().format("YYYY-MM-DD") + "/" + moment().format("HHmm") + ".jpg";

	let camera = new RaspiCam({
		mode: "photo",
		output: savePath,
		encoding: "jpg",
		timeout: 100,
		rotation,
		width,
		height,
	});
	camera.start();
	camera.once("exit", function (timestamp) {
		fs.copyFileSync(savePath, '/data/now.jpg');
	});
}

setInterval(function () {
	if (start <= moment().hour() && moment().hour() <= end) {
		takePhoto();
	}
}, intervalSec * 1000);