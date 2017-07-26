'use strict';
const adbkit = require('adbkit');
const chalk = require('chalk');

class ADBDevices {
	constructor(client = adbkit.createClient()) {
		this.adb = client;
		this.devices = [];

		this.refreshDevices();
		this.adb.trackDevices().then(tracker => tracker.on('changeSet', () => {
			this.refreshDevices();
		}));
	}

	async refreshDevices() {
		this.devices = await this.adb.listDevicesWithPaths();

		console.log(chalk.gray('Refreshed ADB devices:'))
		this.devices.forEach(device => console.log(chalk.gray('  ' + device)));
	}

	*[Symbol.iterator]() {
		for (const device of this.devices) {
			if (device.type === 'device') yield device.path;
		}
	}
}

let deviceTracker;
/**
 * Returns a list of device paths from ADB. (looks like `usb:xxx`)
 * Since one of my phones doesn't have a serial number for some reason,
 * this allows the devices to be identified anyways.
 * @returns {Promise<string[]>}
 */
async function getCellWallDevices() {
	if (!deviceTracker) deviceTracker = new ADBDevices();
	return [...deviceTracker];
}

/**
 * Runs a shell command on every device
 * @param {string} command
 * @param {string[]} [devices] - list of devices
 */
async function multiShell(command, devices, client = adbkit.createClient()) {
	const deviceList = devices || await getCellWallDevices();
	await Promise.all(deviceList.map(id => client.shell(id, command)));
}

/**
 * Triggers a button on every connected android device, or only on specified
 * devices.
 * @param {number} keycode - number of the key to use
 * @param {string[]} [devices] - list of devices
 */
async function triggerButton(keycode, devices) {
	return multiShell(`input keyevent ${keycode}`, devices);
}

module.exports = {
	ADBDevices,
	getCellWallDevices,
	multiShell,
	triggerButton,
};
