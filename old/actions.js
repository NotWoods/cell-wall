'use strict';
const { sendAutoRemoteMessage } = require('./utils/autoremote');
const { triggerEventIFTTT } = require('./utils/ifttt');
const ADBHelper = require('./utils/adb');
const logger = require('./utils/logger');

const adb = new ADBHelper();

async function doorbellRung() {
	logger('doorbell', 'doorbell activated');

	const [autoRemoteRequest, iftttRequest] = await Promise.all([
		sendAutoRemoteMessage('doorbell'),
		triggerEventIFTTT('doorbell')
	]);

	logger('doorbell', 'doorbell notifications sent');

	return { autoRemoteRequest, iftttRequest };
}

async function toggleCellWallPower() {
	logger('cellwall', 'toggling power on CellWall');

	await adb.triggerButton(26);

	logger('cellwall', 'power toggling complete');
}

async function devicesTurnedOn() {
	const powerStates = await adb.map(d => checkIfOn(d.path));
	const devices = adb.getDevices();

	let status = {};
	for (let i = 0; i < devices.length; i++) {
		status[devices[i].path] = powerStates[i];
	}
	return status;
}

module.exports = {
	doorbellRung,
	toggleCellWallPower,
};
