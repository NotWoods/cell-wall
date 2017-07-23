'use strict';
const { stringify } = require('querystring');
const fetch = require('fetch');
const { autoremote } = require('./secret.json');

/**
 * Send a message to Tasker on Android via AutoRemote
 * @param {string} message The text you want to send
 * @param {object} [options]
 * @param {string} [options.target] Sets the Target on this message
 * @param {string} [options.sender] The device that receives this message will
 * reply to this device key when choosing "Last Sender" in the devices list)
 * @param {string} [options.password] The password you have configured
 * on your device
 * @param {number} [options.ttl] Time in seconds AutoRemote will try to deliver
 * the message for before giving up
 * @param {string} [options.collapseKey] If the receiving device is unreachable,
 * only one message in a message group will be delivered. Useful you if e.g.
 * leave a device in airplane mode at night and only want to receive the last of
 * the messages that were sent during that time. Leave blank to deliver all messages.
 */
function sendAutoRemoteMessage(message, options = {}) {
	const url = `https://autoremotejoaomgcd.appspot.com/sendmessage?`;
	let opts = { key: autoremote, message };

	if (typeof options.target === 'string') opts.target = options.target;
	if (typeof options.sender === 'string') opts.sender = options.sender;
	if (typeof options.password === 'string') opts.password = options.password;
	if (typeof options.ttl === 'number') opts.ttl = options.ttl;
	if (typeof options.collapseKey === 'string') opts.collapseKey = options.collapseKey;

	return fetch(url + stringify(opts));
}

module.exports = {
	sendAutoRemoteMessage,
};
