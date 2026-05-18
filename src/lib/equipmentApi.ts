import { apiFetch } from '@/lib/api';
import type { Equipment, EquipmentPayload, PaginatedResponse } from '@/types';

function authHeaders(token: string) {
  return { token };
}

export async function listEquipment(
  token: string,
  params: { pageNumber: number; resultsPerPage: number; searchQuery?: string },
): Promise<PaginatedResponse<Equipment>> {
  const query = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    resultsPerPage: String(params.resultsPerPage),
  });
  if (params.searchQuery?.trim()) {
    query.set('searchQuery', params.searchQuery.trim());
  }

  const response = await apiFetch(`/Equipment?${query}`, authHeaders(token));
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Failed to load equipment');
  }
  return response.json();
}

export async function getEquipment(token: string, id: string): Promise<Equipment> {
  const response = await apiFetch(`/Equipment/${id}`, authHeaders(token));
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Failed to load equipment item');
  }
  return response.json();
}

export async function createEquipment(token: string, payload: EquipmentPayload): Promise<void> {
  const response = await apiFetch('/Equipment', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...authHeaders(token),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Failed to create equipment');
  }
}

export async function updateEquipment(
  token: string,
  id: string,
  payload: EquipmentPayload,
): Promise<void> {
  const response = await apiFetch(`/Equipment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    ...authHeaders(token),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Failed to update equipment');
  }
}

export async function deleteEquipment(token: string, id: string): Promise<void> {
  const response = await apiFetch(`/Equipment/${id}`, {
    method: 'DELETE',
    ...authHeaders(token),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Failed to delete equipment');
  }
}
