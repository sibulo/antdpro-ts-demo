import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'

export async function queryTemplates(params: object): Promise<IResponse<any>> {
  return request(`/api/v1/templates?${stringify(params)}`)
}

export async function queryById(params: { id: number }): Promise<IResponse<any>> {
  return request(`/api/v1/templates/${params.id}`)
}

export async function removeTemplates(params: { id: number }): Promise<IResponse<any>> {
  return request(`/api/v1/templates/${params.id}`, {
    method: 'DELETE',
  })
}

export async function addTemplates(params: object): Promise<IResponse<any>> {
  return request('/api/v1/templates', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function updateTemplates(id: number, params: object): Promise<IResponse<any>> {
  return request(`/api/v1/templates/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}
