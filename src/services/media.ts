import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'
import { message } from 'antd'

let n = 0

export async function queryMedias(params): Promise<IResponse<any>> {
  message.info(`请求第${(n += 1)}次`)
  return request(`/api/v1/medias?${stringify(params)}`)
}

export async function queryMediasByMediaId(params: object): Promise<IResponse<any>> {
  return request(`/api/v1/{mediaId}/medias?${stringify(params)}`)
}

export async function queryById(params): Promise<IResponse<any>> {
  return request(`/api/v1/medias/${params.id}`)
}

export async function removeMedias(params): Promise<IResponse<any>> {
  return request(`/api/v1/medias/${params.id}`, {
    method: 'DELETE',
  })
}

export async function addMedias(params): Promise<IResponse<any>> {
  return request('/api/v1/medias', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function updateMedias(id, params): Promise<IResponse<any>> {
  return request(`/api/v1/medias/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}
