'use strict';
const chalk = require('chalk');
const adbkit = require('adbkit');
const { sendAutoRemoteMessage } = require('./utils/autoremote');
const { triggerEventIFTTT } = require('./utils/ifttt');
const { ADBDevices, triggerButton } = require('./utils/adb');
const { timeString } = require('./utils/time');

const adb = adbkit.createClient();

async function doorbellRung() {
	const icon = chalk.yellow('[d] ');
	console.log(icon + timeString() + ' - doorbell activated');

	const [autoRemoteRequest, iftttRequest] = await Promise.all([
		sendAutoRemoteMessage('doorbell'),
		triggerEventIFTTT('doorbell', { value1: new Date().toISOString() })
	]);

	console.log(icon + 'doorbell notifications sent');

	return { autoRemoteRequest, iftttRequest };
}

async function toggleCellWallPower() {
	const icon = chalk.green('[w] ');
	console.log(icon + timeString() + ' - toggling power on CelLWall');
	const devices = await ADBDevices.getReadyInstance();
	await triggerButton(26, [...devices], adb);
	console.log(icon + 'power toggling complete');
}

module.exports = {
	doorbellRung,
	toggleCellWallPower,
};
