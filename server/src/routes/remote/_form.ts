export async function post(action: string, body: object): Promise<Response> {
	try {
		const res = await fetch(action, {
			method: 'post',
			headers: {
				'content-type': 'application/json'
			},
			body: JSON.stringify(body)
		});

		if (!res.ok) {
			throw new Error(res.statusText);
		}

		return res;
	} catch (err) {
		console.error(err);
		throw err;
	}
}
