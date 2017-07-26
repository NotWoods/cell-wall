'use strict';
const express = require('express');
const ip = require('ip');
const chalk = require('chalk');

const app = express();
const { getButton } = require('./utils/dash-button');
const { wrapForExpress } = require('./utils/express');
const { devicesTurnedOn } = require('./status');
const { doorbellRung, toggleCellWallPower } = require('./actions');

app.use(express.static('public'));
app.use('/gallery', express.static('gallery'));

app.get('/status/devices-on', wrapForExpress(devicesTurnedOn));

app.get('/cmd/doorbell', wrapForExpress(doorbellRung));
app.get('/cmd/cellwall-power', wrapForExpress(toggleCellWallPower));
try {
	getButton('doorbell').on('detected', doorbellRung);
	getButton('cellwall_power').on('detected', toggleCellWallPower);
} catch (err) {
	if (process.platform !== 'win32') {
		console.warn('Can\'t listen for dash buttons. Do you have sudo permissions?');
		console.warn(err);
	}
}

app.listen(80, () => {
	console.log(chalk.green(`smart-dorm running at ${ip.address()}:80`));
});

