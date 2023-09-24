async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  if (!res.ok) {
    throw new Error(text);
  } else {
    return text && JSON.parse(text);
  }
}

function withParams(url: string, params?: Record<string, string>) {
  if (!params) {
    return url;
  }
  const urlSearchParams = new URLSearchParams(params);
  return `${url}?${urlSearchParams.toString()}`;
}

async function get<T>(url: string, params?: Record<string, string>) {
  const res = await fetch(withParams(url, params), {
    method: "GET",
  });
  return await parse<T>(res);
}

async function post<T>(
  url: string,
  body?: unknown,
  params?: Record<string, string>,
) {
  const res = await fetch(withParams(url, params), {
    method: "POST",
    body: JSON.stringify(body),
  });
  return await parse<T>(res);
}

async function del<T>(url: string, params?: Record<string, string>) {
  const res = await fetch(withParams(url, params), {
    method: "DELETE",
  });
  return await parse<T>(res);
}

export { get, post, del };
