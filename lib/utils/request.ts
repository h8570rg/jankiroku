export const get: <T>(url: string) => Promise<T> = async (url) => {
  const response = await fetch(url);
  const data = await response.json();
  return data;
};

export const post: <T>(url: string, body?: unknown) => Promise<T> = async (
  url,
  body
) => {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return data;
};
