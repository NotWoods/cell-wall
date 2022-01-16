async function post(action, body) {
  try {
    const res = await fetch(action, {
      method: "post",
      headers: {
        "content-type": "application/json"
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
function formDataAsSearchParams(formData) {
  const params = new URLSearchParams();
  for (const [key, value] of formData) {
    if (typeof value === "string") {
      params.append(key, value);
    }
  }
  return params;
}
export { formDataAsSearchParams as f, post as p };
