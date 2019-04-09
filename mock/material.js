import { parse } from 'url'
import mockjs from 'mockjs'

const getMaterials = (req, res, u) => {
  const dataSource = mockjs.mock({
    'list|100': [
      {
        'id|+1': 1,
        'name|1': [mockjs.Random.cword(3, 6), mockjs.Random.cword(3, 6), mockjs.Random.cword(3, 6)],
        'companyCode|1': ['alibaba', 'baidu', 'tencent'],
        'companyName|1': ['阿里巴巴', '百度', '腾讯'],
        url: 'https://placeimg.com/200/100/any',
        'fileType|1': ['image/jpg', 'image/png', 'text/html', 'application/msword'],
        width: 200,
        height: 100,
        'len|1': [30516, 42356, 12553, 315155, 125655],
        'type|1': [1, 2],
        'comment|1': [
          mockjs.Random.cparagraph(1, 3),
          mockjs.Random.cparagraph(1, 3),
          mockjs.Random.cparagraph(1, 3),
        ],
        createTime: mockjs.mock('@datetime()'),
        createUserId: '001',
        createUserName: mockjs.mock('@cname()'),
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

export default {
  'GET /api/v1/materials': getMaterials,
}
