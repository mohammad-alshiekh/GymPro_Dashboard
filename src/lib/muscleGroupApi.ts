import { apiFetch } from '@/lib/api';
import type { MuscleGroup, MuscleGroupPayload, PaginatedResponse } from '@/types';

function authHeaders(token: string) {
  return { token };
}

export async function listMuscleGroups(
  token: string,
  params: { pageNumber: number; resultsPerPage: number; searchQuery?: string },
): Promise<PaginatedResponse<MuscleGroup>> {
  const query = new URLSearchParams({
    pageNumber: String(params.pageNumber),
    resultsPerPage: String(params.resultsPerPage),
  });
  if (params.searchQuery?.trim()) {
    query.set('searchQuery', params.searchQuery.trim());
  }

  const response = await apiFetch(`/MuscleGroup?${query}`, authHeaders(token));
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Failed to load muscle groups');
  }
  return response.json();
}

export async function getMuscleGroup(token: string, id: string): Promise<MuscleGroup> {
  const response = await apiFetch(`/MuscleGroup/${id}`, authHeaders(token));
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Failed to load muscle group');
  }
  return response.json();
}

export async function createMuscleGroup(token: string, payload: MuscleGroupPayload): Promise<void> {
  const response = await apiFetch('/MuscleGroup', {
    method: 'POST',
    body: JSON.stringify(payload),
    ...authHeaders(token),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Failed to create muscle group');
  }
}

export async function updateMuscleGroup(
  token: string,
  id: string,
  payload: MuscleGroupPayload,
): Promise<void> {
  const response = await apiFetch(`/MuscleGroup/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    ...authHeaders(token),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Failed to update muscle group');
  }
}

export async function deleteMuscleGroup(token: string, id: string): Promise<void> {
  const response = await apiFetch(`/MuscleGroup/${id}`, {
    method: 'DELETE',
    ...authHeaders(token),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || 'Failed to delete muscle group');
  }
}
