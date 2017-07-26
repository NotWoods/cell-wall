'use strict';

function wrapForExpress(func) {
	return async (req, res) => {
		try {
			await func();
			res.sendStatus(200);
		} catch (err) {
			console.error(`500: ${String(err)}`);
			res.sendStatus(500);
		}
	}
}

module.exports = {
	wrapForExpress,
};
