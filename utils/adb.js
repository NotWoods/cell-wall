'use strict';
const { inspect } = require('util');
const adbkit = require('adbkit');
const chalk = require('chalk');
const StreamSnitch = require('stream-snitch');

class ADBDevices {
	constructor(client = adbkit.createClient()) {
		this.adb = client;
		this.devices = [];

		this.ready = this.refreshDevices();
		this.adb.trackDevices().then(tracker => tracker.on('changeSet', () => {
			this.refreshDevices();
		}));
	}

	static getInstance() {
		if (!ADBDevices.instance) ADBDevices.instance = new ADBDevices();
		return ADBDevices.instance;
	}

	static async getReadyInstance() {
		const instance = await ADBDevices.getInstance();
		await instance.ready;
		return instance;
	}

	async refreshDevices() {
		this.devices = await this.adb.listDevicesWithPaths();

		console.log(chalk.gray('Refreshed ADB devices:'))
		this.devices
			.forEach(device => console.log(chalk.gray('  ' + inspect(device))));
	}

	*[Symbol.iterator]() {
		for (const device of this.devices) {
			if (device.type === 'device') yield device;
		}
	}
}

/**
 * Returns a list of device paths from ADB. (looks like `usb:xxx`)
 * Since one of my phones doesn't have a serial number for some reason,
 * this allows the devices to be identified anyways.
 * @returns {Promise<string[]>}
 */
async function getCellWallDevices() {
	const tracker = ADBDevices.getReadyInstance();
	return [...tracker];
}

/**
 * Runs a shell command on every device
 * @param {string} command
 * @param {string[]} [devices] - list of devices
 */
async function multiShell(command, devices, client = adbkit.createClient()) {
	const deviceList = devices || await getCellWallDevices();
	await Promise.all(deviceList.map(({ path }) => client.shell(id, command)));
}

/**
 * Triggers a button on every connected android device, or only on specified
 * devices.
 * @param {number} keycode - number of the key to use
 * @param {string[]} [devices] - list of devices
 */
async function triggerButton(keycode, devices, client) {
	return multiShell(`input keyevent ${keycode}`, devices, client);
}

/**
 * Checks if an android device is on
 * @param {string} serial - device identifier
 * @param {adbkit.Client} client
 * @returns {Promise<boolean>}
 */
function checkIfOn(serial, client = adbkit.createClient()) {
	return client.shell(serial, 'dumpsys power')
		.then(powerState => new Promise(resolve => {
			const snitch = new StreamSnitch(/mWakefulness=(\w+)/);
			snitch.on('match', wakefulness => {
				powerState.destroy();
				snitch.destroy();
				resolve(wakefulness);
			})
		}))
		.then(wakefulness => {
			switch (wakefulness) {
				case 'Awake': return true;
				default:
					return false;
			}
		});
}

module.exports = {
	ADBDevices,
	getCellWallDevices,
	multiShell,
	triggerButton,
};
