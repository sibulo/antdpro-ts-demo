import { queryMaterials, removeMaterials, addMaterials, updateMaterials } from '@/services/material'
import { message } from 'antd'

export default {
  namespace: 'material',

  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    *fetch({ payload, callback }, { call, put }) {
      try {
        const response = yield call(queryMaterials, payload)
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
    add: [
      function*({ payload, callback }, { call }) {
        try {
          const response = yield call(addMaterials, payload)
          if (response.code === -1) {
            message.error(response.msg)
          } else if (callback) callback()
        } catch (error) {
          message.error(error)
        }
      },
      { type: 'takeLatest' },
    ],
    *remove({ payload, callback }, { call }) {
      try {
        const response = yield call(removeMaterials, payload)
        if (response.code === -1) {
          message.error(response.msg)
        } else if (callback) callback()
      } catch (error) {
        message.error(error)
      }
    },
    *update({ payload, callback }, { call }) {
      try {
        const response = yield call(updateMaterials, payload.id, payload.params)
        if (response.code === 0) {
          message.success(response.msg)
        } else {
          message.error(response.msg)
        }
        if (callback) callback()
      } catch (error) {
        message.error(error)
      }
    },
    *updateByName({ payload, callback }, { call, put }) {
      try {
        const response = yield call(updateMaterials, payload.id, payload.params)
        if (response.code === 0) {
          yield put({
            type: 'saveByName',
            payload,
          })
          if (callback) callback()
        } else {
          message.error(response.msg)
        }
      } catch (error) {
        message.error(error)
      }
    },
    *updateByCell({ payload, callback }, { call }) {
      try {
        const response = yield call(updateMaterials, payload.id, payload.params)
        if (response.code === 0) {
          message.success(response.msg)
        } else {
          message.error(response.msg)
        }
        if (callback) callback()
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
                name: action.payload.params.name,
              }
            }
            return item
          }),
        },
      }
    },
  },
}
