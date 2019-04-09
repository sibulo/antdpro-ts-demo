import { stringify } from 'qs'
import request from '@/utils/request'
import { IResponse } from '@/services/interface'

export async function queryCustomers(params: object): Promise<IResponse<any>> {
  return request(`/api/v1/common/customers?${stringify(params)}`)
}

export async function queryContracts(params: object): Promise<IResponse<any>> {
  return request(`/api/v1/common/contracts?${stringify(params)}`)
}

export async function queryMediaAll(): Promise<IResponse<any>> {
  return request(`/api/v1/common/media/Linkages`)
}

export async function queryDate(): Promise<IResponse<any>> {
  return request(`/api/v1/date`)
}

