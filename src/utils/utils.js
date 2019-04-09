import moment from 'moment'
import React from 'react'
import nzh from 'nzh/cn'
import { parse, stringify } from 'qs'

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val
}

export function getTimeDistance(type) {
  const now = new Date()
  const oneDay = 1000 * 60 * 60 * 24

  if (type === 'today') {
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)
    return [moment(now), moment(now.getTime() + (oneDay - 1000))]
  }

  if (type === 'week') {
    let day = now.getDay()
    now.setHours(0)
    now.setMinutes(0)
    now.setSeconds(0)

    if (day === 0) {
      day = 6
    } else {
      day -= 1
    }

    const beginTime = now.getTime() - day * oneDay

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))]
  }

  if (type === 'month') {
    const year = now.getFullYear()
    const month = now.getMonth()
    const nextDate = moment(now).add(1, 'months')
    const nextYear = nextDate.year()
    const nextMonth = nextDate.month()

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ]
  }

  const year = now.getFullYear()
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)]
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = []
  nodeList.forEach(node => {
    const item = node
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/')
    item.exact = true
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path))
    } else {
      if (item.children && item.component) {
        item.exact = false
      }
      arr.push(item)
    }
  })
  return arr
}

export function digitUppercase(n) {
  return nzh.toMoney(n)
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!') // eslint-disable-line
  }
  const arr1 = str1.split('/')
  const arr2 = str2.split('/')
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2
  }
  return 3
}

function getRenderArr(routes) {
  let renderArr = []
  renderArr.push(routes[0])
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1)
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3)
    if (isAdd) {
      renderArr.push(routes[i])
    }
  }
  return renderArr
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  )
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''))
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes)
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1)
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    }
  })
  return renderRoutes
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1])
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query)
  if (search.length) {
    return `${path}?${search}`
  }
  return path
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/

export function isUrl(path) {
  return reg.test(path)
}

export function formatWan(val) {
  const v = val * 1
  if (!v || Number.isNaN(v)) return ''

  let result = val
  if (val > 10000) {
    result = Math.floor(val / 10000)
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    )
  }
  return result
}

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export function isAntdPro() {
  return window.location.hostname === 'preview.pro.ant.design'
}

export function loadScript(url, callback) {
  const script = document.createElement('script')
  script.type = 'text/javascript'
  script.async = true
  script.src = url
  document.querySelector('head').appendChild(script)
  // eslint-disable-next-line
  script.onload = script.onreadystatechange = () => {
    const rdyState = script.readyState
    if (!rdyState || /complete|loaded/.test(script.readyState)) {
      if (callback) {
        callback()
      }
      script.onload = null
      script.onreadystatechange = null
    }
  }
}

export function checkWH(file, width, height) {
  return new Promise((resolve, reject) => {
    const filereader = new FileReader()
    filereader.onload = e => {
      const src = e.target.result
      const image = new Image()
      // eslint-disable-next-line
      image.onload = function() {
        if ((width && this.width !== width) || (height && this.height !== height)) {
          // eslint-disable-next-line
          reject('图片分辨率不符!')
        } else {
          resolve(true)
        }
      }
      image.onerror = reject
      image.src = src
    }
    filereader.readAsDataURL(file)
  })
}

export function splitTemplate(content) {
  if (!content) {
    return {
      html: '',
      js: '',
      css: '',
    }
  }
  const htmlStart = content.substring(0, content.indexOf('<style>'))
  const htmlEnd = content.substring(content.lastIndexOf('</div>'))
  const html = htmlStart + htmlEnd
  const styleReg = /<style(([\s\S])*?)<\/style>/
  const css = styleReg
    .exec(content)[0]
    .replace('<style>', '')
    .replace('</style>', '')
  const scriptReg = /<script(([\s\S])*?)<\/script>/
  const js = scriptReg
    .exec(content)[0]
    .replace('<script>', '')
    .replace('</script>', '')
  return {
    html,
    css,
    js,
  }
}

export function mergeTemplate({ html, js, css }) {
  const htmlStart = html.substring(0, html.lastIndexOf('</div>'))
  const htmlEnd = html.substring(html.lastIndexOf('</div>'))
  const rjs = `<script>${js}</script>`
  const rcss = `<style>${css}</style>`
  return htmlStart + rcss + rjs + htmlEnd
}
