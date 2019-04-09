import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'

export async function queryChannels(params): Promise<IResponse<any>> {
  return request(`/api/v1/channels?${stringify(params)}`)
}

export async function queryChannelsByMediaId(id: number, params: any): Promise<IResponse<any>> {
  return request(`/api/v1/${id}/channels?${stringify(params)}`)
}

export async function queryById(params): Promise<IResponse<any>> {
  return request(`/api/v1/channels/${params.id}`)
}

export async function removeChannels(params): Promise<IResponse<any>> {
  return request(`/api/v1/channels/${params.id}`, {
    method: 'DELETE',
  })
}

export async function addChannels(params): Promise<IResponse<any>> {
  return request('/api/v1/channels', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function updateChannels(id, params): Promise<IResponse<any>> {
  return request(`/api/v1/channels/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}
