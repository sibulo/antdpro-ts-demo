import * as React from 'react'
import { Modal } from 'antd'
import PlaceLimitTable from '@/components/PlaceLimitTable/'

interface IProps {
  modalFormatVisible: boolean
  currentCells: any
  currentType: any
  currentTypeCode: string
  handleFormatAdd: () => void
  handleRowRemove: (args: any) => void
  handleRowAdd: () => void
  handleColRemove: (args: any) => void
  handleColAdd: () => void
  handleModalFormatVisible: () => void
}

const FormatModal: React.SFC<IProps> = props => {
  const {
    modalFormatVisible,
    handleFormatAdd,
    handleRowRemove,
    handleRowAdd,
    handleColRemove,
    handleColAdd,
    handleModalFormatVisible,
    currentCells,
    currentTypeCode,
  } = props
  return (
    <Modal
      destroyOnClose
      width={760}
      title="广告位状态"
      visible={modalFormatVisible}
      maskClosable={false}
      onOk={() => handleFormatAdd()}
      onCancel={() => handleModalFormatVisible()}
    >
      <PlaceLimitTable
        code={currentTypeCode}
        handleRowRemove={handleRowRemove}
        handleRowAdd={handleRowAdd}
        handleColRemove={handleColRemove}
        handleColAdd={handleColAdd}
        currentCells={currentCells}
      />
    </Modal>
  )
}

export default FormatModal
