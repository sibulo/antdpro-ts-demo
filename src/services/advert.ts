import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'

export async function queryAdverts(params: object): Promise<IResponse<any>> {
  return request(`/api/v1/adverts?${stringify(params)}`)
}

export async function queryAdvertSequences(params: object): Promise<IResponse<any>> {
  return request(`/api/v1/adverts/sequences?${stringify(params)}`)
}

export async function queryById(params: { id: number }): Promise<IResponse<any>> {
  return request(`/api/v1/adverts/${params.id}`)
}

export async function removeAdverts(params: { id: number }): Promise<IResponse<any>> {
  return request(`/api/v1/adverts/${params.id}`, {
    method: 'DELETE',
  })
}

export async function addAdverts(params: object): Promise<IResponse<any>> {
  return request('/api/v1/adverts', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function updateAdverts(id: number, params: object): Promise<IResponse<any>> {
  return request(`/api/v1/adverts/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}

export async function updateAdvertAudit(id: Number): Promise<IResponse<any>> {
  return request(`/api/v1/adverts/${id}/audit`, {
    method: 'PUT',
  })
}

export async function updateAdvertStop(id: Number): Promise<IResponse<any>> {
  return request(`/api/v1/adverts/${id}/terminate`, {
    method: 'PUT',
  })
}

export async function queryAdvertsPreviews(id: string, params: object): Promise<IResponse<any>> {
  return request(`/api/v1/adverts/${id}/previews?${stringify(params)}`)
}
