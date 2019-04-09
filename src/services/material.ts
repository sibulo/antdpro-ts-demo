import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'

export async function queryMaterials(params: object): Promise<IResponse<any>> {
  return request(`/api/v1/materials?${stringify(params)}`)
}

export async function removeMaterials(params: { id: number }): Promise<IResponse<any>> {
  return request(`/api/v1/materials/${params.id}`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  })
}

export async function addMaterials(params: object): Promise<IResponse<any>> {
  return request('/api/v1/materials', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function updateMaterials(id: number, params: object): Promise<IResponse<any>> {
  return request(`/api/v1/materials/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}
