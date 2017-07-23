'use strict';
//const express = require('express');
//const ip = require('ip');
const chalk = require('chalk');

//const app = express();
const { getButton } = require('./utils/dash-button');
const { sendAutoRemoteMessage } = require('./utils/autoremote');

getButton('doorbell').on('detected', () => {
	console.log(chalk.keyword('orange')('Doorbell dash button pressed'));
	sendAutoRemoteMessage('doorbell');
});
/*
app.use(express.static('public'));

app.listen(3000, () => {
	console.log(`smart-dorm running at ${ip.address()}:3000`);
})
*/
