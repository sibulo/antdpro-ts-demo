import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'

export async function queryStats(params): Promise<IResponse<any>> {
  return request(`/api/stats?${stringify(params)}`)
}
