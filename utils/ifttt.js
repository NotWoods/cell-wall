'use strict';
const fetch = require('node-fetch');
const { ifttt_maker } = require('../secret.json');

/**
 * Trigger a fetch event to the IFTTT maker channel. Triggers the event with
 * the given name, with optional data values that can be passed in.
 * @param {string} eventName
 * @param {string|object} [bodyParams]
 * @returns {Promise<Response>}
 */
function triggerEventIFTTT(eventName, bodyParams) {
	const url = `https://maker.ifttt.com/trigger/${event}/with/key/${ifttt_maker}`;

	let init;
	if (bodyParams) {
		init = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: typeof bodyParams === 'object'
				? JSON.stringify(bodyParams)
				: String(bodyParams)
		};
	}

	return fetch(url, init);
}

module.exports = {
	triggerEventIFTTT,
};
