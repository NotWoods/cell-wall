'use strict';
const express = require('express');
const ip = require('ip');
const chalk = require('chalk');

const app = express();
const { getButton } = require('./utils/dash-button');
const { doorbellRung, toggleCellWallPower } = require('./actions');

console.log(chalk.gray('Starting program...'));

function wrapForExpress(func) {
	return (req, res) => func()
		.then(() => res.sendStatus(200))
		.catch(err => {
			console.error(`500: ${String(err)}`);
			res.sendStatus(500);
		});
}

app.use(express.static('public'));
app.use('/gallery', express.static('gallery'));

app.get('/cmd/doorbell', wrapForExpress(doorbellRung));
app.get('/cmd/cellwall-power', wrapForExpress(toggleCellWallPower));
try {
	getButton('doorbell').on('detected', doolbellRung);
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

