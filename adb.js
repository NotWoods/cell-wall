'use strict';
const chalk = require('chalk');
const { triggerButton, multiShell } = require('./utils/adb');

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
	return multiShell(
		'am broadcast -a android.intent.action.DOCK_EVENT' +
		' --ei android.intent.extra.DOCK_STATE 1',
		devices
	);
}
/**
 * Docks every phone
 * @param {string[]|Promise<string[]>} [devices] - list of devices
 */
function undockAll(devices) {
	return multiShell(
		'am broadcast -a android.intent.action.DOCK_EVENT' +
		' --ei android.intent.extra.DOCK_STATE 0',
		devices
	);
}


module.exports = {
	adb,
	powerAll,
	dockAll,
	undockAll,
};
