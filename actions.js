'use strict';
const chalk = require('chalk');
const { sendAutoRemoteMessage } = require('./utils/autoremote');
const { triggerEventIFTTT } = require('./utils/ifttt');
const { triggerButton } = require('./utils/adb');
const { timeString } = require('./utils/time');

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
	await triggerButton(26);
	console.log(icon + 'power toggling complete');
}

module.exports = {
	doorbellRung,
	toggleCellWallPower,
};
