import { parse } from 'url'
import mockjs from 'mockjs'

const getPlaceTypes = (req, res, u) => {
  const dataSource = mockjs.mock({
    'list|100': [
      {
        'id|+1': 1,
        'code|1': [mockjs.mock('@string'), mockjs.mock('@string'), mockjs.mock('@string')],
        'name|1': [mockjs.Random.cword(3, 6), mockjs.Random.cword(3, 6), mockjs.Random.cword(3, 6)],
        createdAt: mockjs.mock('@datetime()'),
        updatedAt: mockjs.mock('@datetime()'),
      },
    ],
  })

  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }

  const params = parse(url, true).query

  let pageSize = 10
  if (params.pageSize) {
    pageSize = params.pageSize * 1
  }

  const result = {
    code: 0,
    msd: '请求成功',
    data: {
      ...dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(params.currentPage, 10) || 1,
      },
    },
  }

  return res.json(result)
}

const getPlaceTypeById = (req, res, u) => {
  const result = {
    id: 1,
    'code|1': ['zzdf', 'xzjy', 'md'],
    'name|1': [mockjs.Random.cword(3, 6), mockjs.Random.cword(3, 6), mockjs.Random.cword(3, 6)],
    createTime: mockjs.mock('@datetime()'),
    updateTime: mockjs.mock('@datetime()'),
  }

  return res.json(result)
}

export default {
  'GET /api/v1/place/types': getPlaceTypes,
  'GET /api/v1/place/types/:id': getPlaceTypeById,
}
