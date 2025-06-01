export async function apiRequest(
  method: string,
  url: string,
  data?: unknown
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }

  return res;
}

export async function fetchWeather(lat: number, lon: number) {
  const response = await apiRequest('GET', `/api/weather?lat=${lat}&lon=${lon}`);
  return response.json();
}

export async function fetchNews(category: string) {
  const response = await apiRequest('GET', `/api/news?category=${category}`);
  return response.json();
}

export async function fetchAstronomy(lat: number, lon: number) {
  const response = await apiRequest('GET', `/api/astronomy?lat=${lat}&lon=${lon}`);
  return response.json();
}
