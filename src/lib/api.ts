/**
 * Default `/api` is same-origin:
 * - local: Vite proxy → https://gymbro.runasp.net
 * - Vercel: vercel.json rewrite → https://gymbro.runasp.net
 * Override with VITE_API_BASE_URL only if you proxy elsewhere.
 */
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '/api';

export function apiUrl(path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

export async function apiFetch(
  path: string,
  options: RequestInit & { token?: string | null } = {},
): Promise<Response> {
  const { token, headers: customHeaders, ...rest } = options;
  const headers = new Headers(customHeaders);
  headers.set('accept', '*/*');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (rest.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(apiUrl(path), { ...rest, headers });
}
