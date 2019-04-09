import { parse } from 'url'
import mockjs from 'mockjs'

const getAdverts = (req, res, u) => {
  const dataSource = mockjs.mock({
    'list|100': [
      {
        'id|+1': 1,
        code: /[A-Z]{3}[0-9]{10}/,
        'companyName|1': ['阿里巴巴', '百度', '腾讯'],
        'companyCode|1': ['alibaba', 'baidu', 'tencent'],
        width: 1670,
        height: 1005,
        material: {
          url: 'https://placeimg.com/200/100/any',
          name: '素材名称',
        },
        'placeName|1': [
          'APP - 首页黄金展位（240*60）',
          'PC－首页黄金展位（240*60）',
          'H5 - 首页黄金展位（240*60）',
          'H5 - 首页黄金展位（240*60）',
        ],
        'statusName|1': ['已预定', '待审核', '即将投放', '投放中', '已结束', '已终止'],
        'status|1': [1, 2, 3, 4, 5, 6],
        remark: mockjs.Random.cparagraph(1, 3),
        startTime: mockjs.mock('@datetime()'),
        endTime: mockjs.mock('@datetime()'),
        updateTime: mockjs.mock('@datetime()'),
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
    msg: '请求成功',
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

const getAdvertsById = (req, res, u) => {
  const result = {
    adCode: /[A-Z]{3}[0-9]{10}/,
    title: '阿里巴巴',
    adName: 'APP - 首页黄金展位（240*60）',
    media: '0',
    place: ['餐饮频道', '黄金展位(440x200)'],
    adType: '1',
    contractCode: 'SSDSVU135431',
    linkType: '1',
    url: 'http://www.baidu.com',
    status: '已预订',
    remark: mockjs.Random.cparagraph(1, 3),
    startDate: mockjs.mock('@datetime()'),
    endDate: mockjs.mock('@datetime()'),
    startAt: mockjs.mock('@datetime()'),
    endAt: mockjs.mock('@datetime()'),
    createdAt: mockjs.mock('@datetime()'),
    createdUser: mockjs.mock('@cname()'),
  }

  return res.json(result)
}

const getScheduler = (req, res, u) => {
  const data = {
    date: '2019-02-18',
    placeId: '1',
    resources: [
      {
        id: 'r1',
        name: '1号',
      },
      {
        id: 'r2',
        name: '2号',
      },
      {
        id: 'r3',
        name: '3号',
      },
      {
        id: 'r4',
        name: '4号',
      },
      {
        id: 'r5',
        name: '5号',
      },
    ],
    events: [
      {
        id: 1,
        start: '2019-02-18',
        end: '2019-02-19',
        resourceId: 'r1',
        title: '维也纳国际酒店 - 肖三群',
        bgColor: '#D9D9D9',
        type: 1,
        status: '即将投放',
        rankDate: '12.19-12.19',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 2,
        start: '2019-02-18',
        end: '2019-02-26',
        resourceId: 'r2',
        title: '维也纳国际酒店 - 肖三群',
        type: 2,
        status: '投放中',
        rankDate: '12.18-12.26',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 3,
        start: '2019-02-19',
        end: '2019-02-20',
        resourceId: 'r3',
        title: '维也纳国际酒店 - 肖三群',
        type: 3,
        status: '已结束',
        rankDate: '12.19-12.20',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 4,
        start: '2019-02-19',
        end: '2019-02-20',
        resourceId: 'r4',
        title: '维也纳国际酒店 - 肖三群',
        type: 1,
        status: '即将投放',
        rankDate: '12.19-12.20',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 5,
        start: '2019-02-19',
        end: '2019-02-20',
        resourceId: 'r5',
        title: '维也纳国际酒店 - 肖三群',
        type: 2,
        status: '投放中',
        rankDate: '12.19-12.20',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 6,
        start: '2019-02-21',
        end: '2019-02-27',
        resourceId: 'r1',
        title: '维也纳国际酒店 - 肖三群',
        type: 3,
        status: '已结束',
        rankDate: '12.21-12.27',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 7,
        start: '2019-02-27',
        end: '2019-02-29',
        resourceId: 'r2',
        title: '维也纳国际酒店 - 肖三群',
        bgColor: '#FA9E95',
        type: 1,
        status: '即将投放',
        rankDate: '12.21-12.23',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 8,
        start: '2019-02-23',
        end: '2019-02-25',
        resourceId: 'r3',
        title: '维也纳国际酒店 - 肖三群',
        bgColor: 'red',
        type: 2,
        status: '投放中',
        rankDate: '12.23-12.25',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 9,
        start: '2019-02-22',
        end: '2019-02-27',
        resourceId: 'r4',
        title: '维也纳国际酒店 - 肖三群',
        type: 3,
        status: '已结束',
        rankDate: '12.22-12.27',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 10,
        start: '2019-02-22',
        end: '2019-03-20',
        resourceId: 'r5',
        title: '维也纳国际酒店 - 肖三群',
        type: 1,
        status: '即将投放',
        rankDate: '12.22-01.20',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 11,
        start: '2019-02-27',
        end: '2019-02-28',
        resourceId: 'r3',
        title: '维也纳国际酒店 - 肖三群',
        type: 2,
        status: '投放中',
        rankDate: '12.27-12.28',
        url: 'https://placeimg.com/200/100/any',
      },
      {
        id: 12,
        start: '2019-02-29',
        end: '2019-02-30',
        resourceId: 'r1',
        title: '维也纳国际酒店 - 肖三群',
        type: 3,
        status: '已结束',
        rankDate: '12.29-12.30',
        url: 'https://placeimg.com/200/100/any',
      },
    ],
  }

  const result = {
    data,
  }

  return res.json(result)
}

export default {
  'GET /api/v1/adverts': getAdverts,
  'GET /api/v1/adverts/scheduler': getScheduler,
  'GET /api/v1/adverts/:id': getAdvertsById,
}
