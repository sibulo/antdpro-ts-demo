import * as React from 'react'
import { Button, Modal, message } from 'antd'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import CustomCodemirror from '@/components/CustomCodemirror'

interface IProps {
  modalBuildCodeVisible: boolean
  handleModalBuildCodeVisible: () => void
  placeId: string
}

const BuildCode: React.SFC<IProps> = props => {
  const { modalBuildCodeVisible, handleModalBuildCodeVisible } = props
  const value = `<script>
  (function () {
    var s = document.getElementsByTagName('script');
    var c = s[s.length - 1].parentNode;
    var j = document.createElement('script');
    j.type = 'text/javascript';
    j.async = true;
    j.src = '//f3-df.veimg.cn/plutus/plutus-0.3.0.min.js';
    j.onload = j.onreadystatechange = function() {
      var rdyState = j.readyState
      if (!rdyState || /complete|loaded/.test(j.readyState)) {
        new DfwsPlutus({
          placeId: '${props.placeId}', container: c
        }).getMedia();
        j.onload = null
        j.onreadystatechange = null
      }
    }
    var t = document.getElementsByTagName("script")[0];
    t.parentNode.insertBefore(j, t);
  })();
  </script>
  `
  const syncValue = `<script src="//f3-df.veimg.cn/plutus/plutus-0.3.0.min.js#placeId=${
    props.placeId
  }"></script>
  `

  const desc = `
  // 同步
  ${syncValue}
  // 异步
  ${value}
  `

  const remark = `
  /* 代码说明
  new DfwsPlutus({placeId:'84', container:c, conifg: {
      url: './test.html',
      stats: true,
      statsUrl: '//f3-v.veimg.cn/ve_www/images/zhaopinday.png'
  }})
  placeId: 广告位ID
  container: 广告位容器
  conifg: 广告位配置
    url: 广告位HTML地址，默认原始HTML地址
    stats: 是否统计，默认true
    statsUrl: 统计地址，默认原始统计地址
  */
  `

  return (
    <Modal
      destroyOnClose
      title="生成代码"
      visible={modalBuildCodeVisible}
      maskClosable={false}
      width={960}
      onCancel={() => handleModalBuildCodeVisible()}
      footer={[
        <CopyToClipboard
          text={syncValue}
          onCopy={(text, result) => {
            if (result) {
              message.success('复制成功')
            } else {
              message.error('复制失败')
            }
          }}
        >
          <Button key="copy">复制同步代码到剪切板</Button>
        </CopyToClipboard>,
        <CopyToClipboard
          text={value}
          onCopy={(text, result) => {
            if (result) {
              message.success('复制成功')
            } else {
              message.error('复制失败')
            }
          }}
        >
          <Button key="copy">复制异步代码到剪切板</Button>
        </CopyToClipboard>,
        <Button key="back" onClick={() => handleModalBuildCodeVisible()}>
          关闭
        </Button>,
      ]}
    >
      <CustomCodemirror value={desc + remark} mode="js" style={{ width: '100%' }} />
    </Modal>
  )
}

export default BuildCode
