'use strict';
let createDashButton;
const secret = require('../secret.json');

/**
 * Creates a dash button instance or throws an error if the name is invalid
 * @param {string} name
 */
function getButton(name) {
	try {
		if (!createDashButton) createDashButton = require('node-dash-button');
	} catch (err) {
		createDashButton = new Error('Could not load node-dash-button');
	}
	if (createDashButton instanceof Error) throw createDashButton;

	if (secret.dash_buttons[name]) {
		return createDashButton(secret.dash_buttons[name]);
	} else {
		throw new Error(`${name} does not exist in secret.json under 'dash_buttons'`);
	}
}

module.exports = {
	getButton
}
