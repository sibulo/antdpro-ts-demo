import { queryScheduler } from '@/services/scheduler.ts'
import moment from 'moment'

export default {
  namespace: 'scheduler',

  state: {
    data: {
      date: moment().format('YYYY-MM-DD'),
      resources: [],
      events: [],
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryScheduler, payload)
      yield put({
        type: 'save',
        payload: response.data,
      })
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          ...action.payload,
        },
      }
    },
  },
}
