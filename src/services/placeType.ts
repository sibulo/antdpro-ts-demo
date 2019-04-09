import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'

export async function queryPlaceTypes(params): Promise<IResponse<any>> {
  return request(`/api/v1/place/types?${stringify(params)}`)
}

export async function queryById(params): Promise<IResponse<any>> {
  return request(`/api/v1/place/types/${params.id}`)
}

export async function removePlaceTypes(params): Promise<IResponse<any>> {
  return request(`/api/v1/place/types/${params.id}`, {
    method: 'DELETE',
  })
}

export async function addPlaceTypes(params): Promise<IResponse<any>> {
  return request('/api/v1/place/types', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function updatePlaceTypes(id, params): Promise<IResponse<any>> {
  return request(`/api/v1/place/types/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}
