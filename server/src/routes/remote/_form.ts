export function filterValue<Value, Result extends Value>(
	predicate: (value: Value) => value is Result
): <Key>(entry: [Key, Value]) => entry is [Key, Result];
export function filterValue<Value>(
	predicate: (value: Value) => boolean
): (entry: [unknown, Value]) => boolean;
export function filterValue<Value>(
	predicate: (value: Value) => boolean
): (entry: [unknown, Value]) => boolean {
	return ([, value]) => predicate(value);
}

export async function post(action: string, body: object) {
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

export function formData(form: HTMLFormElement): Array<[string, string]> {
	return (
		Array.from(new FormData(form))
			// no files allowed
			.filter(filterValue((value): value is string => typeof value === 'string'))
			// nor empty strings
			.filter(filterValue(Boolean))
	);
}
