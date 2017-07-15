'use strict';
const express = require('express');
const dashButton = require('node-dash-button');
const ip = require('ip');
const chalk = require('chalk');

const app = express();
const dashA = dashButton('B4:7C:9C:30:98:0D');
const dashB = dashButton('68:37:E9:DD:AB:68');

dashA.on('detected', () => {
	console.log(chalk.orange('Dash button A pressed'));
});

dashB.on('detected', () => {
	console.log(chalk.orange('Dash button B pressed'));
})

app.use(express.static('public'));

app.listen(3000, () => {
	console.log(`smart-dorm running at ${ip.address()}:3000`);
})
