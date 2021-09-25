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

export function formDataAsSearchParams(formData: FormData): URLSearchParams {
	const params = new URLSearchParams();
	for (const [key, value] of formData) {
		if (typeof value === 'string') {
			params.append(key, value);
		}
	}
	return params;
}
