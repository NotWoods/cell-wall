'use strict';
const adbkit = require('adbkit');
const { ADBDevices, checkIfOn } = require('./utils/adb');

const adb = adbkit.createClient();

async function devicesTurnedOn() {
	const devices = [...(await ADBDevices.getReadyInstance())];
	const powerStates = await Promise.all(devices.map(d => checkIfOn(d.path, adb)));

	let status = {};
	for (let i = 0; i < devices.length; i++) {
		status[devices[i].path] = powerStates[i];
	}
	return status;
}

module.exports = {
	devicesTurnedOn,
};
