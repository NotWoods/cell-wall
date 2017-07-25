'use strict';
const moment = require('moment');
const chalk = require('chalk');

/**
 * Formats the given time in a string for displaying in the terminal.
 * @param {object} [options]
 * @param {Date} [options.time]
 * @param {boolean} [options.nocolor]
 * @returns {string}
 * @example
 * 12:30 am on Jul 1
 */
function timeString({ now, nocolor = false } = {}) {
	now = moment(now);
	const time = now.format('h:mm a');
	const date = now.format('MMM D');

	let result = `${time} on ${date}`;
	if (!nocolor) { result = chalk.gray(result); }
	return result;
}

module.exports = {
	timeString,
}
