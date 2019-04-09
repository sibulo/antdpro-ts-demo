import * as React from 'react'
import { Form, Input, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import { IFormField } from '@/pages/RebaseGroup/List'

const FormItem = Form.Item

interface IFormComponentProps extends FormComponentProps {
  modalVisible: boolean
  current: IRebaseGroupModel
  handleAdd: (arg: IFormField) => void
  handleEdit: (arg: IFormField) => void
  handleModalVisible: (arg?: boolean) => void
}

const CreateForm: React.SFC<IFormComponentProps> = props => {
  const { modalVisible, form, handleAdd, handleEdit, handleModalVisible, current } = props

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
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
      title={current.id ? '编辑托底广告组' : '新建托底广告组'}
      visible={modalVisible}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {form.getFieldDecorator('id', {
        initialValue: current.id || '',
      })(<Input type="hidden" />)}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="名称">
        {form.getFieldDecorator('name', {
          initialValue: current.name || '',
          rules: [{ required: true, whitespace: true, message: '请输入托底广告组名称！' }],
        })(<Input placeholder="请输入托底广告组名称" />)}
      </FormItem>
    </Modal>
  )
}

export default Form.create()(CreateForm)
