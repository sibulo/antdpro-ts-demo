import { queryMedias, queryById, removeMedias, addMedias, updateMedias } from '@/services/media.ts'
import { message } from 'antd'

export default {
  namespace: 'media',

  state: {
    data: {
      list: [],
      pagination: {},
      current: {},
    },
  },

  effects: {
    fetch: [
      function*({ payload, callback }, { call, put }) {
        try {
          message.info('准备请求')
          const response = yield call(queryMedias, payload)
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
      { type: 'takeLatest' },
    ],
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
          const response = yield call(addMedias, payload)
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
        const response = yield call(removeMedias, payload)
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
      try {
        const response = yield call(updateMedias, payload.id, payload.params)
        if (response.code === 0) {
          if (callback) callback()
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
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
