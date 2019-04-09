import {
  addPlaces,
  queryPlaces,
  queryById,
  querySequences,
  queryPreviews,
  queryTemplates,
  updateTemplates,
  removePlaces,
  updatePlaces,
  updatePlacesGridCell,
} from '@/services/place.ts'
import { message } from 'antd'

export default {
  namespace: 'place',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      try {
        const response = yield call(queryPlaces, payload)
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
    *fetchById({ payload, callback }, { call, put }) {
      try {
        const response = yield call(queryById, payload)
        if (response.code === 0) {
          yield put({
            type: 'saveDetail',
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
    *fetchSequenceById({ payload, callback }, { call, put }) {
      try {
        const { id, params } = payload
        const response = yield call(querySequences, id, params)
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
    *fetchTemplateById({ payload, callback }, { call, put }) {
      try {
        const response = yield call(queryTemplates, payload)
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
    *updateTemplates({ payload, callback }, { call, put }) {
      try {
        const response = yield call(updateTemplates, payload)
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
    *fetchPreviewById({ payload, callback }, { call, put }) {
      try {
        const response = yield call(queryPreviews, payload)
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
          const response = yield call(addPlaces, payload)
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
        const response = yield call(removePlaces, payload)
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
    *update({ payload, callback }, { call, put }) {
      try {
        const response = yield call(updatePlaces, payload.id, payload.params)
        if (response.code === 0) {
          yield put({
            type: 'save',
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
    *updateByName({ payload, callback }, { call, put }) {
      try {
        const response = yield call(updatePlaces, payload.id, payload.params)
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
    *updatePlacesGridCell({ payload, callback }, { call }) {
      try {
        const response = yield call(updatePlacesGridCell, payload.id, payload.params)
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
  },
}
