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
 * Runs a shell command on every device
 * @param {string} command
 * @param {string[]|Promise<string[]>} [devices] - list of devices
 */
async function allShell(command, devices = getCellWallDevices()) {
	const deviceList = await devices;
	await Promise.all(deviceList.map(id => adb.shell(id, command)));
}

/**
 * Triggers a button on every connected android device, or only on specified
 * devices.
 * @param {number} keycode - number of the key to use
 * @param {string[]|Promise<string[]>} [devices] - list of devices
 */
async function triggerButton(keycode, devices) {
	return allShell(`input keyevent ${keycode}`);
}

/**
 * Triggers the power button on every android device
 */
async function powerAll() {
	await triggerButton(26);
	console.log(chalk.green('Toggled power on CellWall devices'));
}

/**
 * Docks every phone
 * @param {string[]|Promise<string[]>} [devices] - list of devices
 */
function dockAll(devices) {
	return allShell(`am broadcast -a android.intent.action.DOCK_EVENT --ei android.intent.extra.DOCK_STATE 1`);
}
/**
 * Docks every phone
 * @param {string[]|Promise<string[]>} [devices] - list of devices
 */
function undockAll(devices) {
	return allShell(`am broadcast -a android.intent.action.DOCK_EVENT --ei android.intent.extra.DOCK_STATE 0`);
}


module.exports = {
	adb,
	getCellWallDevices,
	allShell,
	triggerButton,
	powerAll,
	dockAll,
	undockAll,
};
