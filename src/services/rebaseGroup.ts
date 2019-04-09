import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'

export async function queryRebaseGroups(params): Promise<IResponse<any>> {
  return request(`/api/v1/rebase/groups?${stringify(params)}`)
}

export async function queryById(params): Promise<IResponse<any>> {
  return request(`/api/v1/rebase/groups/${params.id}`)
}

export async function removeRebaseGroups(params): Promise<IResponse<any>> {
  return request(`/api/v1/rebase/groups/${params.id}`, {
    method: 'DELETE',
  })
}

export async function addRebaseGroups(params): Promise<IResponse<any>> {
  return request('/api/v1/rebase/groups', {
    method: 'POST',
    body: {
      ...params,
    },
  })
}

export async function updateRebaseGroups(id, params): Promise<IResponse<any>> {
  return request(`/api/v1/rebase/groups/${id}`, {
    method: 'PUT',
    body: {
      ...params,
    },
  })
}
