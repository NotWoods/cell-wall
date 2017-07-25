'use strict';
const adbkit = require('adbkit');
const chalk = require('chalk');

/**
 * Returns a list of device paths from ADB. (looks like `usb:xxx`)
 * Since one of my phones doesn't have a serial number for some reason,
 * this allows the devices to be identified anyways.
 * @param {ADBKit} [client] adbkit client
 * @returns {Promise<string[]>}
 */
async function getCellWallDevices(client = adbkit.createClient()) {
	return (await client.listDevicesWithPaths())
		.filter(device => device.type === 'device')
		.map(device => device.path);
}

/**
 * Runs a shell command on every device
 * @param {string} command
 * @param {string[]} [devices] - list of devices
 * @param {ADBKit} [client] adbkit client
 */
async function multiShell(command, devices, client = adbkit.createClient()) {
	const deviceList = devices || await getCellWallDevices(client);
	await Promise.all(deviceList.map(id => client.shell(id, command)));
}

/**
 * Triggers a button on every connected android device, or only on specified
 * devices.
 * @param {number} keycode - number of the key to use
 * @param {string[]} [devices] - list of devices
 * @param {ADBKit} [client] adbkit client
 */
async function triggerButton(keycode, devices, client) {
	return multiShell(`input keyevent ${keycode}`, devices, client);
}

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
		this.devices = await getCellWallDevices(this.adb);
	}

	getDevices() { return [...this.devices]; }
	[Symbol.iterator]() { return this.devices[Symbol.iterator](); }
}

module.exports = {
	getCellWallDevices,
	multiShell,
	triggerButton,
};
