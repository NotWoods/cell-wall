const adb = require('adbkit');
const client = adb.createClient();

(async () => {
	let devices = await client.listDevicesWithPaths();
	let devicePaths = devices
		.filter(device => device.type === 'device')
		.map(device => device.path);

	await Promise.all(devicePaths.map(usbID => client.shell(usbID, `input keyevent 26`)));
})()
