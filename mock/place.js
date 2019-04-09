import { parse } from 'url'

const getPlaces = (req, res, u) => {
  const dataSource = [
    {
      id: '12200',
      code: 'ZZDFLB00',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 0,
      height: 60,
      width: 240,
      rowNum: 1,
      colNum: 1,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 1,
      rebaseGroup: 0,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12201',
      code: 'ZZDFLB01',
      name: '页奢华展位（440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 0,
      height: 60,
      width: 240,
      rowNum: 1,
      colNum: 1,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '已使用',
          },
        ],
      ],
      rebaseType: 3,
      rebaseGroup: 1,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12202',
      code: 'ZZDFLB02',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 1,
      height: 60,
      width: 240,
      rowNum: 1,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 2,
      rebaseGroup: 0,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12203',
      code: 'ZZDFLB03',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 1,
      height: 60,
      width: 240,
      rowNum: 1,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '已使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '已使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 2,
      rebaseGroup: 0,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12204',
      code: 'ZZDFLB04',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 2,
      height: 60,
      width: 240,
      rowNum: 2,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '已使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '已使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '已使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 2,
      rebaseGroup: 0,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12205',
      code: 'ZZDFLB05',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 2,
      height: 60,
      width: 240,
      rowNum: 2,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '已使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '已使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 3,
      rebaseGroup: 1,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12206',
      code: 'ZZDFLB06',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 2,
      height: 60,
      width: 240,
      rowNum: 2,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 3,
      rebaseGroup: 2,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12207',
      code: 'ZZDFLB07',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 2,
      height: 60,
      width: 240,
      rowNum: 2,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 3,
      rebaseGroup: 3,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12208',
      code: 'ZZDFLB08',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 2,
      height: 60,
      width: 240,
      rowNum: 2,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 1,
      rebaseGroup: 0,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12209',
      code: 'ZZDFLB09',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 2,
      height: 60,
      width: 240,
      rowNum: 2,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 1,
      rebaseGroup: 0,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12210',
      code: 'ZZDFLB10',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 2,
      height: 60,
      width: 240,
      rowNum: 2,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 1,
      rebaseGroup: 0,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12211',
      code: 'ZZDFLB11',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 2,
      height: 60,
      width: 240,
      rowNum: 2,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 1,
      rebaseGroup: 0,
      createTime: '2013-11-12 11:11:11',
    },
    {
      id: '12212',
      code: 'ZZDFLB12',
      name: '奢华展位（ 440*200）',
      channelName: '首页',
      mediaName: '最佳东方',
      type: 2,
      height: 60,
      width: 240,
      rowNum: 2,
      colNum: 5,
      cells: [
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
        [
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
          {
            value: false,
            disabled: true,
            text: '未使用',
          },
        ],
      ],
      rebaseType: 1,
      rebaseGroup: 0,
      createTime: '2013-11-12 11:11:11',
    },
  ]

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
      list: dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(params.currentPage, 10) || 1,
      },
    },
  }

  return res.json(result)
}

const getPlaceById = (req, res, u) => {
  const result = {
    code: 0,
    msd: '请求成功',
    data: {
      list: [],
    },
  }

  return res.json(result)
}

const getTemplateById = (req, res, u) => {
  const result = {
    code: 0,
    msd: '请求成功',
    data: {
      previewHTML: `    <div class="pr">
    <ul class="carousel">
      <p><b class="on"></b> <b></b> <b></b> <b></b> <b></b></p>
      <li>
        <a
          href="//www.veryeast.cn/usershow/goto.html?Aid=kbykby2018121415484"
          target="_blank"
          rel="nofollow"
          ><img
            src="https://p3-v.veimg.cn/sysimg/20181214/b56fd776cfaeb37f7b623eec94661ca9.jpg"
            onclick="ga('send','event','AD','483','0')"
            width="440"
            height="200"
            alt="广州瑰丽酒店"
            title="广州瑰丽酒店"
        /></a>
      </li>
      <li>
        <a
          href="//www.veryeast.cn/usershow/goto.html?Aid=kbykby20181217114418"
          target="_blank"
          rel="nofollow"
          ><img
            src="https://p3-v.veimg.cn/sysimg/20181217/a215c5480e49588795e1c96134b2ddb7.jpg"
            onclick="ga('send','event','AD','483','1')"
            width="440"
            height="200"
            alt="亚特兰蒂斯"
            title="亚特兰蒂斯"
        /></a>
      </li>
      <li>
        <a
          href="//www.veryeast.cn/usershow/goto.html?Aid=kbykby20181217144415"
          target="_blank"
          rel="nofollow"
          ><img
            src="https://p3-v.veimg.cn/sysimg/20181221/615b61a47ee86105d267f70f732b0971.jpg"
            onclick="ga('send','event','AD','483','2')"
            width="440"
            height="200"
            alt="公主号邮轮广告"
            title="公主号邮轮广告"
        /></a>
      </li>
      <li>
        <a
          href="//www.veryeast.cn/usershow/goto.html?Aid=kbykby2018151523"
          target="_blank"
          rel="nofollow"
          ><img
            src="https://p3-v.veimg.cn/sysimg/20181203/b09df0653deaf4280a3bdc91021bd003.jpg"
            onclick="ga('send','event','AD','483','3')"
            width="440"
            height="200"
            alt="前厅专场"
            title="前厅专场"
        /></a>
      </li>
      <li>
        <a
          href="//www.veryeast.cn/usershow/goto.html?Aid=kbykby20181218152454"
          target="_blank"
          rel="nofollow"
          ><img
            src="https://p3-v.veimg.cn/sysimg/20181218/720c6b785b87ee5403fddaafd966f1ca.jpg"
            onclick="ga('send','event','AD','483','4')"
            width="440"
            height="200"
            alt="客房专场"
            title="客房专场"
        /></a>
      </li>
    </ul>
    </div>`,
      previewJS: `$(function() {
      var $wrap = $('.carousel'),
        $list = $wrap.find('li'),
        $b = $wrap.find('p b')
      ;(len = $list.length), (i = 0), (ii = 0), (carousel = null)

      if ($list[1]) {
        play()

        $list
          .mouseover(function() {
            clearInterval(carousel)
          })
          .mouseout(function() {
            play()
          })

        $b.click(function() {
          clearInterval(carousel)
          $(this)
            .addClass('on')
            .siblings()
            .removeClass('on')
          $list
            .eq($(this).index())
            .fadeIn()
            .siblings('li')
            .hide()
          play($(this).index())
        })
      } else {
        $b.hide()
      }

      function play(index) {
        i = index || i
        carousel = setInterval(function() {
          i = i % len
          $list.eq(i).fadeOut(function() {
            ii = (i + 1) % len
            $list.eq(ii).fadeIn()
            $b.eq(ii)
              .addClass('on')
              .siblings()
              .removeClass('on')
            i++
          })
        }, 5000)
      }
    })`,
      previewCSS: `.pr {
      position: relative;
    }

    .carousel p {
      position: absolute;
      bottom: 0;
      left: 150px;
      z-index: 15;
      _bottom: 8px;
      width: 150px;
      height: 20px;
      text-align: center;
    }

    .carousel p b {
      display: inline-block;
      width: 10px;
      height: 10px;
      _line-height: 10px;
      _font-size: 0;
      margin: 0 3px;
      *margin: 0 4px;
      background: #afafaf;
      background: url(https://www.veryeast.cn/images/dian2.png) no-repeat\9;
      _background: url(https://www.veryeast.cn/images/dot.gif) no-repeat 0 -11px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
      border-radius: 5px;
      cursor: pointer;
    }

    .carousel p b.on {
      background: #ef8318;
      background: url(https://www.veryeast.cn/images/dian.png) no-repeat\9;
      _background: url(https://www.veryeast.cn/images/dot.gif) no-repeat 0 0;
    }

    .carousel p b.hide {
      display: none;
    }

    .carousel {
      width: 438px;
      height: 198px;
      margin-bottom: 10px;
      _margin-bottom: 8px;
      overflow: hidden;
    }

    .carousel li {
      _zoom: 1;
    }

    .carousel li img {
      width: 438px;
      height: 198px;
    }

    img {
      display: block;
      border: none;
    }
    * {
      margin: 0px;
      padding: 0px;
      font-family: microsoft yahei;
      font-size: 12px;
      color: #999;
    }`,
    },
  }

  return res.json(result)
}

const getPreviewById = (req, res, u) => {
  const result = {
    code: 0,
    msd: '请求成功',
    data: {
      previewHTML: `    <div class="pr">
    <ul class="carousel">
      <p><b class="on"></b> <b></b> <b></b> <b></b> <b></b></p>
      <li>
        <a
          href="//www.veryeast.cn/usershow/goto.html?Aid=kbykby2018121415484"
          target="_blank"
          rel="nofollow"
          ><img
            src="https://p3-v.veimg.cn/sysimg/20181214/b56fd776cfaeb37f7b623eec94661ca9.jpg"
            onclick="ga('send','event','AD','483','0')"
            width="440"
            height="200"
            alt="广州瑰丽酒店"
            title="广州瑰丽酒店"
        /></a>
      </li>
      <li>
        <a
          href="//www.veryeast.cn/usershow/goto.html?Aid=kbykby20181217114418"
          target="_blank"
          rel="nofollow"
          ><img
            src="https://p3-v.veimg.cn/sysimg/20181217/a215c5480e49588795e1c96134b2ddb7.jpg"
            onclick="ga('send','event','AD','483','1')"
            width="440"
            height="200"
            alt="亚特兰蒂斯"
            title="亚特兰蒂斯"
        /></a>
      </li>
      <li>
        <a
          href="//www.veryeast.cn/usershow/goto.html?Aid=kbykby20181217144415"
          target="_blank"
          rel="nofollow"
          ><img
            src="https://p3-v.veimg.cn/sysimg/20181221/615b61a47ee86105d267f70f732b0971.jpg"
            onclick="ga('send','event','AD','483','2')"
            width="440"
            height="200"
            alt="公主号邮轮广告"
            title="公主号邮轮广告"
        /></a>
      </li>
      <li>
        <a
          href="//www.veryeast.cn/usershow/goto.html?Aid=kbykby2018151523"
          target="_blank"
          rel="nofollow"
          ><img
            src="https://p3-v.veimg.cn/sysimg/20181203/b09df0653deaf4280a3bdc91021bd003.jpg"
            onclick="ga('send','event','AD','483','3')"
            width="440"
            height="200"
            alt="前厅专场"
            title="前厅专场"
        /></a>
      </li>
      <li>
        <a
          href="//www.veryeast.cn/usershow/goto.html?Aid=kbykby20181218152454"
          target="_blank"
          rel="nofollow"
          ><img
            src="https://p3-v.veimg.cn/sysimg/20181218/720c6b785b87ee5403fddaafd966f1ca.jpg"
            onclick="ga('send','event','AD','483','4')"
            width="440"
            height="200"
            alt="客房专场"
            title="客房专场"
        /></a>
      </li>
    </ul>
    </div>`,
      previewJS: `$(function() {
      var $wrap = $('.carousel'),
        $list = $wrap.find('li'),
        $b = $wrap.find('p b')
      ;(len = $list.length), (i = 0), (ii = 0), (carousel = null)

      if ($list[1]) {
        play()

        $list
          .mouseover(function() {
            clearInterval(carousel)
          })
          .mouseout(function() {
            play()
          })

        $b.click(function() {
          clearInterval(carousel)
          $(this)
            .addClass('on')
            .siblings()
            .removeClass('on')
          $list
            .eq($(this).index())
            .fadeIn()
            .siblings('li')
            .hide()
          play($(this).index())
        })
      } else {
        $b.hide()
      }

      function play(index) {
        i = index || i
        carousel = setInterval(function() {
          i = i % len
          $list.eq(i).fadeOut(function() {
            ii = (i + 1) % len
            $list.eq(ii).fadeIn()
            $b.eq(ii)
              .addClass('on')
              .siblings()
              .removeClass('on')
            i++
          })
        }, 5000)
      }
    })`,
      previewCSS: `.pr {
      position: relative;
    }

    .carousel p {
      position: absolute;
      bottom: 0;
      left: 150px;
      z-index: 15;
      _bottom: 8px;
      width: 150px;
      height: 20px;
      text-align: center;
    }

    .carousel p b {
      display: inline-block;
      width: 10px;
      height: 10px;
      _line-height: 10px;
      _font-size: 0;
      margin: 0 3px;
      *margin: 0 4px;
      background: #afafaf;
      background: url(https://www.veryeast.cn/images/dian2.png) no-repeat\9;
      _background: url(https://www.veryeast.cn/images/dot.gif) no-repeat 0 -11px;
      -webkit-border-radius: 5px;
      -moz-border-radius: 5px;
      -ms-border-radius: 5px;
      -o-border-radius: 5px;
      border-radius: 5px;
      cursor: pointer;
    }

    .carousel p b.on {
      background: #ef8318;
      background: url(https://www.veryeast.cn/images/dian.png) no-repeat\9;
      _background: url(https://www.veryeast.cn/images/dot.gif) no-repeat 0 0;
    }

    .carousel p b.hide {
      display: none;
    }

    .carousel {
      width: 438px;
      height: 198px;
      margin-bottom: 10px;
      _margin-bottom: 8px;
      overflow: hidden;
    }

    .carousel li {
      _zoom: 1;
    }

    .carousel li img {
      width: 438px;
      height: 198px;
    }

    img {
      display: block;
      border: none;
    }
    * {
      margin: 0px;
      padding: 0px;
      font-family: microsoft yahei;
      font-size: 12px;
      color: #999;
    }`,
    },
  }

  return res.json(result)
}

export default {
  'GET /api/v1/places': getPlaces,
  'GET /api/v1/places/:id': getPlaceById,
  'GET /api/v1/places/:id/templates': getTemplateById,
  'GET /api/v1/places/:id/previews': getPreviewById,
}
