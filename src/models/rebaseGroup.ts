import {
  queryRebaseGroups,
  queryById,
  removeRebaseGroups,
  addRebaseGroups,
  updateRebaseGroups,
} from '@/services/rebaseGroup.ts'
import { message } from 'antd'

export default {
  namespace: 'rebaseGroup',

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
        const response = yield call(queryRebaseGroups, payload)
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
          const response = yield call(addRebaseGroups, payload)
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
        const response = yield call(removeRebaseGroups, payload)
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
        const response = yield call(updateRebaseGroups, payload.id, payload.params)
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
