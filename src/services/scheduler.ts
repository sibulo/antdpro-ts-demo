import { stringify } from 'qs'
import request from '@/utils/request'

export async function queryScheduler(params: object) {
  return request(`/api/v1/adverts/scheduler?${stringify(params)}`)
}
