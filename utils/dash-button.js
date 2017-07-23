'use strict';
const createDashButton = require('node-dash-button');
const secret = require('../secret.json');

/**
 * Creates a dash button instance or throws an error if the name is invalid
 * @param {string} name
 */
function getButton(name) {
	if (secret.dash_buttons[name]) {
		return createDashButton(secret.dash_buttons[name]);
	} else {
		throw new Error(`${name} does not exist in secret.json under 'dash_buttons'`);
	}
}

module.exports = {
	getButton
}
