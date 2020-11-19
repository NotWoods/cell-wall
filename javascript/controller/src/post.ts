export async function post(action: string, body: object) {
  try {
    const res = await fetch(action, {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
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

export function formData(form: HTMLFormElement) {
  return (
    Array.from(new FormData(form))
      // no files allowed
      .filter(
        (entry): entry is [string, string] => typeof entry[1] === 'string',
      )
      // nor empty strings
      .filter(([_, value]) => value)
  );
}
