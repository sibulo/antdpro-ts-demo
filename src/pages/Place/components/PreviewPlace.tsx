import * as React from 'react'
import { Modal, Button } from 'antd'
import IframePreview from '@/components/IframePreview'
import { splitTemplate } from '@/utils/utils'

interface IProps {
  modalPreviewVisible: boolean
  previews: string
  handleModalPreviewVisible: () => void
}

const PreviewPlace: React.SFC<IProps> = props => {
  const {
    modalPreviewVisible,
    handleModalPreviewVisible,
    previews,
  } = props
  const { html, css, js } = splitTemplate(previews)
  return (
    <Modal
      destroyOnClose
      title="广告位预览"
      visible={modalPreviewVisible}
      maskClosable={false}
      width={650}
      onCancel={() => handleModalPreviewVisible()}
      footer={[
        <Button key="back" onClick={() => handleModalPreviewVisible()}>
          关闭
        </Button>,
      ]}
    >
      <IframePreview html={html} js={js} css={css} />
    </Modal>
  )
}

export default PreviewPlace
