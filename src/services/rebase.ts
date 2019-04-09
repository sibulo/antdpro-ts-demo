import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'

export async function queryRebases(params): Promise<IResponse<any>> {
  return request(`/api/v1/rebases?${stringify(params)}`)
}

export async function queryById(params): Promise<IResponse<any>> {
  return request(`/api/v1/rebases/${params.id}`)
}

export async function removeRebases(params): Promise<IResponse<any>> {
  return request(`/api/v1/rebases/${params.id}`, {
    method: 'DELETE',
  })
}

export async function addRebases(params): Promise<IResponse<any>> {
  return request('/api/v1/rebases', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function updateRebases(id, params): Promise<IResponse<any>> {
  return request(`/api/v1/rebases/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}
