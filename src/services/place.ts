import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'

export async function queryPlaces(params: object): Promise<IResponse<any>> {
  return request(`/api/v1/places?${stringify(params)}`)
}

export async function querySequences(placeId: number, params: object): Promise<IResponse<any>> {
  return request(`/api/v1/places/${placeId}/sequences?${stringify(params)}`)
}

export async function queryById(params): Promise<IResponse<any>> {
  return request(`/api/v1/places/${params.id}`)
}

export async function queryTemplates(params: { id: number }): Promise<IResponse<any>> {
  return request(`/api/v1/places/${params.id}/templates`)
}

export async function updateTemplates(params): Promise<IResponse<any>> {
  return request(`/api/v1/places/${params.id}/templates`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}

export async function queryPreviews(params: { id: number }): Promise<IResponse<any>> {
  return request(`/api/v1/places/${params.id}/previews`)
}

export async function removePlaces(params: { id: number }): Promise<IResponse<any>> {
  return request(`/api/v1/places/${params.id}`, {
    method: 'DELETE',
  })
}

export async function addPlaces(params: object): Promise<IResponse<any>> {
  return request('/api/v1/places', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function updatePlaces(id: number, params: object): Promise<IResponse<any>> {
  return request(`/api/v1/places/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}

export async function updatePlacesGridCell(id: number, params: object): Promise<IResponse<any>> {
  return request(`/api/v1/places/${id}/cell`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}
