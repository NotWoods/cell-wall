'use strict';
const moment = require('moment');
const chalk = require('chalk');

/**
 * Formats the given time in a string for displaying in the terminal.
 * @param {Date} [now]
 * @returns {string}
 * @example
 * 12:30 am on Jul 1
 */
function timeString(now) {
	now = moment(now);
	const time = now.format('h:mm a');
	const date = now.format('MMM D');

	return `${time} on ${date}`;
	return result;
}

const CHANNEL = {
	doorbell: { icon: 'd', color: 'yellow' },
	cellwall: { icon: 'w', color: 'green' },
	android: { icon: 'a', color: 'gray', text_color: 'gray' },
	error: { icon: 'e', color: 'red', stderr: true }
}

/**
 * Logs a message with a timestamp, colored based on a channel
 * @param {string} channel
 * @param {string} message
 */
function logger(channel, message) {
	const channelInfo = CHANNEL[channel]
	const icon = chalk[channelInfo.color](`[${channelInfo.icon}]`) + ' ';

	let msg = ' - ' + message;
	if (channelInfo.text_color) msg = chalk[channelInfo.text_color](msg);

	const toLog = icon + chalk.gray(timeString()) + message;
	if (channelInfo.stderr) {
		console.error(toLog);
	} else {
		console.log(toLog);
	}
}

module.exports = logger;
