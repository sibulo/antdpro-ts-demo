import {
  addAdverts,
  queryAdverts,
  queryById,
  queryAdvertsPreviews,
  removeAdverts,
  updateAdverts,
  updateAdvertAudit,
  updateAdvertStop,
} from '@/services/advert.ts'
import { queryMaterials } from '@/services/material.ts'
import { message } from 'antd'

export default {
  namespace: 'advert',

  state: {
    data: {
      list: [],
      pagination: {},
      current: {},
      uploader: {
        list: [],
        pagination: {},
      },
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        const response = yield call(queryAdverts, payload)
        if (response.code === 0) {
          yield put({
            type: 'save',
            payload: response.data,
          })
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    *fetchById({ payload, callback }, { call, put }) {
      try {
        const response = yield call(queryById, payload)
        if (response.code === 0) {
          yield put({
            type: 'saveById',
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
    *fetchPreviewById({ payload, callback }, { call, put }) {
      try {
        const { id, ...params } = payload
        const response = yield call(queryAdvertsPreviews, id, params)
        if (response.code === 0) {
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
    add: [
      function*({ payload, callback }, { call }) {
        try {
          const response = yield call(addAdverts, payload)
          if (response.code === 0) {
            if (callback) {
              callback()
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
    *remove({ payload, callback }, { call }) {
      try {
        const response = yield call(removeAdverts, payload)
        if (response.code === 0) {
          if (callback) {
            callback()
          }
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    edit: [
      function*({ payload, callback }, { call }) {
        try {
          const { id, ...params } = payload
          const response = yield call(updateAdverts, id, params)
          if (response.code === 0) {
            if (callback) {
              callback()
            }
          } else {
            message.error(response.msg)
          }
        } catch (error) {}
      },
      { type: 'takeLatest' },
    ],
    *updateAdvertAudit({ payload, callback }, { call, put }) {
      try {
        const response = yield call(updateAdvertAudit, payload.id)
        if (response.code === 0) {
          if (callback) {
            callback()
          }
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    *updateAdvertStop({ payload, callback }, { call, put }) {
      try {
        const response = yield call(updateAdvertStop, payload.id)
        if (response.code === 0) {
          if (callback) {
            callback()
          }
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    *updateByName({ payload, callback }, { call, put }) {
      try {
        const response = yield call(updateAdverts, payload.id, payload.params)
        if (response.code === 0) {
          yield put({
            type: 'saveByName',
            payload,
          })
          if (callback) {
            callback()
          }
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    *updateByCell({ payload, callback }, { call }) {
      try {
        const response = yield call(updateAdverts, payload.id, payload.params)
        if (response.code === 0) {
          if (callback) {
            callback()
          }
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    *fetchMaterials({ payload, callback }, { call, put }) {
      try {
        const response = yield call(queryMaterials, payload)
        if (response.code === 0) {
          yield put({
            type: 'saveMaterials',
            payload: response.data,
          })
          if (callback) {
            callback()
          }
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
    saveByName(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          list: state.data.list.map(item => {
            if (item.id === action.payload.id) {
              return {
                ...item,
                ...action.payload.row,
              }
            }
            return item
          }),
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
    saveMaterials(state, action) {
      return {
        ...state,
        data: {
          ...state.data,
          uploader: {
            ...state.data.uploader,
            ...action.payload,
            list: action.payload.list.map(data => ({
              ...data,
              key: data.id,
            })),
          },
        },
      }
    },
  },
}
