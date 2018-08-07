'use strict';
const { inspect } = require('util');
const adbkit = require('adbkit');
const chalk = require('chalk');
const StreamSnitch = require('stream-snitch');
const logger = require('./logger');

class ADBHelper {
	constructor(client = adbkit.createClient()) {
		this.client = client;
		this.devices = [];

		this.ready = this.refreshDevices();
		this.isReady = false;

		this.client.trackDevices()
			.then(tracker =>
				tracker.on('changeSet', () => {
					this.refreshDevices();
				})
			);
	}

	async refreshDevices() {
		this.devices = await this.client.listDevicesWithPaths();
		this.isReady = true;

		let log = 'Refreshed ADB devices:\n';
		log += (await this.map(d => `    ${inspect(device)}`)).join('\n');
		logger('android', log);
	}

	/** @returns {Device[]} */
	getDevices() {
		if (!this.isReady) {
			throw new Error('ADBHelper has not yet started');
		}
		return this.devices.filter(d => d.type === 'device');
	}

	/**
	 * @param {(Device, int, Device[]) => Promise<T>} callback
	 * @returns {Promise<Array<T>>}
	 */
	map(callback) {
		return Promise.all(this.getDevices().map(callback));
	}

	forEach(callback) {
		return this.map(callback).then(() => {});
	}

	/**
	 * Triggers a button on every connected android device, or only on specified
	 * devices.
	 * @param {number} keycode - number of the key to use
	 * @returns {Promise<void>}
	 */
	triggerButton(keycode) {
		const command = `input keyevent ${keycode}`;
		return this.forEach(d => this.client.shell(d.path, command));
	}

	/**
	 * Checks if an android device is on
	 * @param {string} serial - device identifier
	 * @returns {Promise<boolean>}
	 */
	async checkIfOn(serial) {
		const powerState = await this.client.shell(serial, 'dumpsys power');

		const wakefulness = await new Promise(resolve => {
			const snitch = new StreamSnitch(/mWakefulness=(\w+)/);
			snitch.on('match', wakefulness => {
				powerState.destroy();
				snitch.destroy();
				resolve(wakefulness);
			})
		});

		return wakefulness == 'Awake';
	}
}

module.exports = ADBHelper;
