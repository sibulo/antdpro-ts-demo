import { parse } from 'url'
import mockjs from 'mockjs'

const getRebases = (req, res, u) => {
  const dataSource = mockjs.mock({
    'list|100': [
      {
        'id|+1': 1,
        'name|1': [mockjs.Random.cword(3, 6), mockjs.Random.cword(3, 6), mockjs.Random.cword(3, 6)],
        materialUrl: 'https://placeimg.com/200/100/any',
        'linkUrl|1': ['http://www.baidu.com', 'http://www.taobao.com', 'http://www.qq.com'],
        createTime: mockjs.mock('@datetime()'),
        updateTime: mockjs.mock('@datetime()'),
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

const getRebaseById = (req, res, u) => {
  const result = {
    id: 1,
    'name|1': [mockjs.Random.cword(3, 6), mockjs.Random.cword(3, 6), mockjs.Random.cword(3, 6)],
    src: 'https://placeimg.com/200/100/any',
    link: ['http://www.baidu.com', 'http://www.taobao.com', 'http://www.qq.com'],
    createdAt: mockjs.mock('@datetime()'),
    updatedAt: mockjs.mock('@datetime()'),
  }

  return res.json(result)
}

export default {
  'GET /api/v1/rebases': getRebases,
  'GET /api/v1/rebases/:id': getRebaseById,
}
