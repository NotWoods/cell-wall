'use strict';
const adbkit = require('adbkit');
const chalk = require('chalk');
const secret = require('./secret.json');

const adb = adbkit.createClient();

/**
 * Returns a list of device paths from ADB. (looks like `usb:xxx`)
 * Since one of my phones doesn't have a serial number for some reason,
 * this allows the devices to be identified anyways.
 * @returns {Promise<string[]>}
 */
async function getCellWallDevices() {
	return (await adb.listDevicesWithPaths())
		.filter(device => device.type === 'device')
		.map(device => device.path);
}

/**
 * Triggers a button on every connected android device, or only on specified
 * devices.
 * @param {number} keycode - number of the key to use
 * @param {string[]|Promise<string[]>} [devices] - list of devices
 */
async function triggerButton(keycode, devices = getCellWallDevices()) {
	const deviceList = await devices;
	const shellCommand = `input keyevent ${keycode}`;

	await Promise.all(deviceList.map(id => adb.shell(id, shellCommand)));
}

/**
 * Triggers the power button on every android device
 */
async function powerAll() {
	await triggerButton(26);
	console.log(chalk.green('Toggled power on CellWall devices'));
}


module.exports = {
	adb,
	getCellWallDevices,
	triggerButton,
	powerAll,
};
