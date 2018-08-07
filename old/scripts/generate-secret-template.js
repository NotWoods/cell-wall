'use strict';
const { writeFileSync } = require('fs');

/**
 * @param {object} baseObject
 * @returns {object}
 */
function replaceKeys(baseObject) {
	if (baseObject === null) return null;

	let replacement = {};
	Object.values(baseObject).forEach(([key, secretCode]) => {
		if (typeof secretCode === 'object') {
			replacement[key] = replaceKeys(secretCode);
		}

		let templateKey = 'XXXXXXXXXXXXXXXX';
		// if (secretCode.matches(...)) ...

		replacement[key] = templateKey;
	});
	return replacement;
}

function generateSecretTemplate() {
	const secret = require('../secret.json');
	const template = replaceKeys(secret);
	writeFileSync('../secret-template.json', JSON.stringify(template), 'utf8');
}
