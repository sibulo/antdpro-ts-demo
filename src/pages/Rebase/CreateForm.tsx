import React, { useState } from 'react'
import { Form, Input, Select, Modal, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import Uploader from '@/pages/Rebase/Uploader'
import { IFormField } from '@/pages/Rebase/List'

const FormItem = Form.Item
const { Option } = Select

const uploadButtonStyle: React.CSSProperties = {
  position: 'absolute',
  left: 122,
  bottom: 20,
}

interface IFormComponentProps extends FormComponentProps {
  modalVisible: boolean
  current: IRebaseModel
  rebaseGroupList: []
  handleAdd: (arg: IFormField) => void
  handleEdit: (arg: IFormField) => void
  handleModalVisible: (arg?: boolean) => void
}

const CreateForm: React.SFC<IFormComponentProps> = props => {
  const [modalUploaderVisible, setModalUploaderVisible] = useState(false)

  const {
    modalVisible,
    form,
    handleAdd,
    handleEdit,
    handleModalVisible,
    current,
    rebaseGroupList,
  } = props

  const imagePlaceholdClass: React.CSSProperties = {
    width: '100%',
    height: 150,
    position: 'relative',
    background:
      form.getFieldValue('materialUrl') || current.materialUrl
        ? `url(${form.getFieldValue('materialUrl') ||
            current.materialUrl}) no-repeat scroll center center / 50%`
        : '#CCFFFF',
    cursor: 'pointer',
  }

  const okHandle = () => {
    form.validateFields((err, fieldsValue: IFormField) => {
      if (err) return
      if (!fieldsValue.materialId) {
        message.error('未选择图片!')
        return
      }
      if (fieldsValue.id) {
        handleEdit(fieldsValue)
      } else {
        delete fieldsValue.id
        handleAdd(fieldsValue)
      }
      form.resetFields()
    })
  }

  const parentMethods = {
    handleModalUploaderVisible: setModalUploaderVisible,
  }

  return (
    <Modal
      destroyOnClose
      title={current.id ? '编辑托底广告' : '新建托底广告'}
      visible={modalVisible}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {form.getFieldDecorator('id', {
        initialValue: current.id || '',
      })(<Input type="hidden" />)}

      {form.getFieldDecorator('materialId', {
        initialValue: current.materialId || '',
      })(<Input type="hidden" />)}

      {form.getFieldDecorator('materialUrl', {
        initialValue: current.materialUrl || '',
      })(<Input type="hidden" />)}

      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="托底广告组">
        {form.getFieldDecorator('groupId', {
          initialValue: current.groupId || [],
          rules: [{ required: true, message: '请选择托底广告组！' }],
        })(
          <Select
            showSearch
            optionFilterProp="children"
            placeholder="请选择托底广告组"
            style={{ width: '100%' }}
          >
            {rebaseGroupList.map((x: any) => (
              <Option key={x.id} value={x.id}>
                {x.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="托底广告名称">
        {form.getFieldDecorator('name', {
          initialValue: current.name || '',
          rules: [{ required: true, whitespace: true, message: '请输入托底广告名称！' }],
        })(<Input placeholder="请输入托底广告名称" />)}
      </FormItem>

      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="托底广告链接">
        {form.getFieldDecorator('linkUrl', {
          initialValue: current.linkUrl || '',
          rules: [{ type: 'url', message: '请输入带http的URL链接！' }],
        })(<Input placeholder="请输入托底广告链接" />)}
      </FormItem>

      <FormItem required labelCol={{ span: 6 }} wrapperCol={{ span: 15 }} label="图片选择">
        <div style={imagePlaceholdClass} onClick={() => setModalUploaderVisible(true)}>
          <div style={uploadButtonStyle}>选择图片</div>
        </div>
      </FormItem>

      <Uploader
        {...parentMethods}
        modalUploaderVisible={modalUploaderVisible}
        current={current}
        form={form}
      />
    </Modal>
  )
}

export default Form.create()(CreateForm)
