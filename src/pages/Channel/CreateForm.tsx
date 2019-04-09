import * as React from 'react'
import { Form, Input, Select, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import { IFormField } from '@/pages/Channel/List'

const FormItem = Form.Item
const { Option } = Select

interface IFormComponentProps extends FormComponentProps {
  modalVisible: boolean
  current: IChannelModel
  mediaList: IMediaModel[]
  handleAdd: (arg: IFormField) => void
  handleEdit: (arg: IFormField) => void
  handleModalVisible: (arg?: boolean) => void
}

const CreateForm: React.SFC<IFormComponentProps> = props => {
  const {
    modalVisible,
    form,
    handleAdd,
    handleEdit,
    handleModalVisible,
    current,
    mediaList,
  } = props

  const okHandle = () => {
    form.validateFields((err, fieldsValue: IFormField) => {
      if (err) return

      form.resetFields()

      if (fieldsValue.id) {
        handleEdit(fieldsValue)
      } else {
        delete fieldsValue.id
        handleAdd(fieldsValue)
      }
    })
  }

  return (
    <Modal
      destroyOnClose
      title={current.id ? '编辑频道' : '新建频道'}
      visible={modalVisible}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {form.getFieldDecorator('id', {
        initialValue: current.id || '',
      })(<Input type="hidden" />)}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="媒体">
        {form.getFieldDecorator('mediaId', {
          initialValue: current.mediaId || [],
          rules: [{ required: true, message: '请选择媒体！' }],
        })(
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="请选择媒体"
            style={{ width: '100%' }}
          >
            {mediaList.map((x: any) => (
              <Option key={x.id} value={x.id}>
                {x.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          initialValue: current.name || '',
          rules: [{ required: true, whitespace: true, message: '请输入名称！' }],
        })(<Input placeholder="请输入名称" />)}
      </FormItem>
    </Modal>
  )
}

export default Form.create()(CreateForm)
