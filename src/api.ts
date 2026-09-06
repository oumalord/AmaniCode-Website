type ApiResponse = { data: any };

async function request(method: string, url: string, body?: Record<string, any>): Promise<ApiResponse> {
  const response = await fetch(url, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const responseBody = await response.text();
  let data: any;
  try {
    data = responseBody ? JSON.parse(responseBody) : {};
  } catch {
    throw new Error(`The server could not save this change (${response.status}). Please try again after the latest deployment is live.`);
  }
  if (!response.ok) throw new Error(data.error || `API request failed (${response.status}).`);
  return { data };
}

export const api = {
  get: (url: string) => request('GET', url),
  post: (url: string, body: Record<string, any>) => request('POST', url, body),
  put: (url: string, body: Record<string, any>) => request('PUT', url, body),
};