import { parse } from 'url'
import mockjs from 'mockjs'

const getStats = (req, res, u) => {
  const dataSource = mockjs.mock({
    'list|100': [
      {
        'id|+1': 1,
        date: mockjs.mock('@datetime()'),
        'impression|1000-10000': 100,
        'clickThrough|10-1000': 100,
        clickThroughRate() {
          return ((this.clickThrough / this.impression) * 100).toFixed(2)
        },
        'IP|10-1000': 100,
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
    ...dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(params.currentPage, 10) || 1,
    },
  }

  return res.json(result)
}

export default {
  'GET /api/stats': getStats,
}
