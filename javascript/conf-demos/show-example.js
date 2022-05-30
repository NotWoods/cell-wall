import { ADB } from 'appium-adb';

async function getConnectedDevices() {
	const adb = await ADB.createADB();
	const devices = await adb.getConnectedDevices();

	console.log(devices);

	return devices.map((device) => {
		const clone = adb.clone();
		clone.setDevice(device);
		return clone;
	});
}

async function helloWorld() {
	const devices = await getConnectedDevices();

	await Promise.all(
		devices.map(async (device) => {
			const KEYCODE_POWER = 26;
			await device.keyevent(KEYCODE_POWER);

			await device.startUri('https://example.com');
		})
	);
}

helloWorld();
