import {
  queryPlaceTypes,
  queryById,
  removePlaceTypes,
  addPlaceTypes,
  updatePlaceTypes,
} from '@/services/placeType.ts'
import { message } from 'antd'

export default {
  namespace: 'placeType',

  state: {
    data: {
      list: [],
      pagination: {},
      current: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      try {
        const response = yield call(queryPlaceTypes, payload)
        if (response.code === 0) {
          yield put({
            type: 'save',
            payload: response.data,
          })
          if (callback) {
            callback(response)
          }
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    *fetchById({ payload }, { call, put }) {
      try {
        const response = yield call(queryById, payload)
        if (response.code === 0) {
          yield put({
            type: 'saveById',
            payload: response.data,
          })
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    add: [
      function*({ payload, callback }, { call }) {
        try {
          const response = yield call(addPlaceTypes, payload)
          if (response.code === 0) {
            if (callback) callback()
          } else {
            message.error(response.msg)
          }
        } catch (error) {
          message.error(error)
        }
      },
      { type: 'takeLatest' },
    ],
    *remove({ payload, callback }, { call }) {
      try {
        const response = yield call(removePlaceTypes, payload)
        if (response.code === 0) {
          if (callback) callback()
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    *edit({ payload, callback }, { call }) {
      yield call(updatePlaceTypes, payload.id, payload.params)
      if (callback) callback()
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload,
          list: action.payload.list.map(data => ({
            ...data,
            key: data.id,
          })),
        },
      }
    },
    saveById(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          current: action.payload,
        },
      }
    },
  },
}
