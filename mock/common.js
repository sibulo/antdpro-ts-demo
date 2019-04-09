import mockjs from 'mockjs'

const getCustomers = (req, res, u) => {
  const dataSource = mockjs.mock({
    'list|10': [
      {
        'id|+1': 1,
        'name|1': ['阿里巴巴', '百度', '腾讯'],
      },
    ],
  })

  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }

  const result = {
    code: 0,
    msg: '请求成功',
    data: { ...dataSource },
  }

  return res.json(result)
}

const getMedias = (req, res, u) => {
  const dataSource = [
    {
      id: 'zhejiang',
      name: 'Zhejiang',
      childrens: [
        {
          id: 'hangzhou',
          name: 'Hangzhou',
          childrens: [
            {
              id: 'xihu',
              name: 'West Lake',
            },
          ],
        },
      ],
    },
    {
      id: 'jiangsu',
      name: 'Jiangsu',
      childrens: [
        {
          id: 'nanjing',
          name: 'Nanjing',
          childrens: [
            {
              id: 'zhonghuamen',
              name: 'Zhong Hua Men',
            },
          ],
        },
      ],
    },
  ]

  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }

  const result = {
    code: 0,
    msg: '请求成功',
    data: dataSource,
  }

  return res.json(result)
}

const getContracts = (req, res, u) => {
  const dataSource = [
    {
      code: 'SDKFHFK',
      statusStr: '未启用',
      startTime: '2019-02-22',
      endTime: '2019-02-25',
    },
    {
      code: 'SDKFHFK',
      statusStr: '未启用',
      startTime: '2019-02-22',
      endTime: '2019-02-25',
    },
    {
      code: 'SDKFHFK',
      statusStr: '未启用',
      startTime: '2019-02-22',
      endTime: '2019-02-25',
    },
    {
      code: 'SDKFHFK',
      statusStr: '未启用',
      startTime: '2019-02-22',
      endTime: '2019-02-25',
    },
    {
      code: 'SDKFHFK',
      statusStr: '未启用',
      startTime: '2019-02-22',
      endTime: '2019-02-25',
    },
  ]

  let url = u
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    url = req.url // eslint-disable-line
  }

  const result = {
    code: 0,
    msg: '请求成功',
    data: dataSource,
  }

  return res.json(result)
}

export default {
  'GET /api/v1/common/customers': getCustomers,
  'GET /api/v1/common/contracts': getContracts,
  'GET /api/v1/common/media/Linkages': getMedias,
}
