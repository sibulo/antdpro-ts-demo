import React, { useState } from 'react'
import { Form, Input, Select, Button, Modal, message, Upload, Icon, Spin } from 'antd'
import moment from 'moment'
import debounce from 'lodash/debounce'
import { FormComponentProps } from 'antd/lib/form/Form'
import { SelectValue } from 'antd/lib/select'
import OSS from 'ali-oss'
import { ALIOSS } from '@/conifg/index.ts'
import { queryCustomers, queryDate } from '@/services/common.ts'

const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input

interface IFormComponentProps extends FormComponentProps {
  modalVisible: boolean
  current: any
  handleEdit: (args: any) => void
  handleAdd: (args: any) => void
  handleModalVisible: () => void
}

const CreateForm: React.SFC<IFormComponentProps> = props => {
  const [companyData, setCompanyData] = useState([])
  const [fetching, setFetching] = useState(false)

  let lastFetchId: number = 0

  const handleChange = (value: SelectValue) => {
    const { form } = props
    form.setFieldsValue({
      company: value,
    })
    setCompanyData([])
    setFetching(false)
  }

  const fetchCompany = (value: string) => {
    lastFetchId += 1
    const fetchId = lastFetchId
    setCompanyData([])
    setFetching(true)
    queryCustomers({ name: value, limit: 10 }).then(res => {
      if (fetchId !== lastFetchId) {
        // for fetch callback order
        return
      }
      const data = res.data.list.map((item: any) => ({
        text: item.name,
        value: item.id,
      }))
      setCompanyData(data)
      setFetching(false)
    })
  }

  const okHandle = () => {
    const { form, handleEdit, handleAdd } = props
    form.validateFields((err, fieldsValue) => {
      if (err) return
      if (!fieldsValue.url) {
        message.error('素材未上传或正在上传中')
        return
      }
      if (fieldsValue.type == 1) {
        if (!(fieldsValue.width || fieldsValue.height)) {
          message.error('素材上传出现异常，请重新上传')
          return
        }
      }
      form.resetFields()
      const params = {
        ...fieldsValue,
        url: fieldsValue.url.replace('dfws.oss-cn-hangzhou.aliyuncs.com', ALIOSS.cdn),
        advId: fieldsValue.company.key,
        companyName: fieldsValue.company.label,
      }
      delete params.file
      delete params.company
      if (params.id) {
        handleEdit(params)
      } else {
        delete params.id
        handleAdd(params)
      }
    })
  }

  const normFile = (e: any) => {
    if (Array.isArray(e)) {
      if (e.length > 1) {
        return e.splice(1)
      }
      return e
    }
    if (e) {
      if (e.fileList.length > 1) {
        return e.fileList.splice(1)
      }
      return e.fileList
    }
  }
  const { modalVisible, form, handleModalVisible, current } = props

  const UploadToOss = (file: any, type: number) =>
    new Promise((resolve, reject) => {
      queryDate()
        .then(res => {
          const client = new OSS({
            region: ALIOSS.region,
            accessKeyId: ALIOSS.accessKeyId,
            accessKeySecret: ALIOSS.accessKeySecret,
            bucket: ALIOSS.bucket,
          })
          const date = moment(res.data).format('YYYY/MM')
          const typeStr = type === 1 ? 'finish' : 'source'
          const url = `plutus/img/${typeStr}/${date}/${file.name.split('.')[0]}-${file.uid}.${
            file.type.split('/')[1]
          }`
          client
            .put(url, file)
            .then(result => {
              resolve(result)
            })
            .catch(error => {
              reject(error)
            })
        })
        .catch(error => {
          message.error('无法获取服务器日期！')
          reject(error)
        })
    })

  const uploadProps = {
    multiple: false,
    name: 'file',
    withCredentials: true,
    beforeUpload: (file: File) => {
      return new Promise((resolve, reject) => {
        const hide = message.loading('上传中...', 0)
        if (form.getFieldValue('type') === 1) {
          const isLt10M = file.size / 1024 / 1024 < 10
          if (!isLt10M) {
            hide()
            message.error('效果素材不能大于10MB!')
            reject(file)
            return false
          }
          const isJPG = file.type === 'image/jpeg'
          const isPNG = file.type === 'image/png'
          const isGIF = file.type === 'image/gif'
          if (!(isJPG || isPNG || isGIF)) {
            hide()
            message.error('效果素材格式不正确')
            reject(file)
            return false
          }
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = (e: any) => {
            const src = e.target.result
            const image = new Image()
            // eslint-disable-next-line
            image.onload = (e: any) => {
              form.setFieldsValue({
                width: e.target.width,
                height: e.target.height,
              })
            }
            image.src = src
          }
          reader.onloadend = () => {
            // 使用ossupload覆盖默认的上传方法
            UploadToOss(file, 1).then(
              (res: any) => {
                hide()
                message.success('上传成功')
                form.setFieldsValue({
                  url: res.url,
                  len: file.size,
                  fileType: file.type,
                  name: file.name.substring(0, file.name.lastIndexOf('.')),
                })
                resolve(file)
              },
              err => {
                hide()
                message.error(`上传失败,错误信息:${err}`)
                reject(file)
                return false
              }
            )
          }
        } else {
          const isLt50M = file.size / 1024 / 1024 < 50
          if (!isLt50M) {
            hide()
            message.error('文件不能大于50MB!')
            reject(file)
            return false
          }
          UploadToOss(file, 2).then(
            (res: any) => {
              hide()
              message.success('上传成功')
              form.setFieldsValue({
                url: res.url,
                len: file.size,
                fileType: file.type,
                name: file.name.substring(0, file.name.lastIndexOf('.')),
              })
              resolve(file)
            },
            err => {
              hide()
              message.error(`上传失败,错误信息:${err}`)
              reject(file)
              return false
            }
          )
        }
      })
    },
  }

  return (
    <Modal
      destroyOnClose
      title={current.id ? '编辑素材' : '新建素材'}
      visible={modalVisible}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      {form.getFieldDecorator('id', {
        initialValue: current.id || '',
      })(<Input type="hidden" />)}

      {form.getFieldDecorator('name', {
        initialValue: current.name || '',
      })(<Input type="hidden" />)}

      {form.getFieldDecorator('width', {
        initialValue: current.width || '',
      })(<Input type="hidden" />)}

      {form.getFieldDecorator('height', {
        initialValue: current.height || '',
      })(<Input type="hidden" />)}

      {form.getFieldDecorator('len', {
        initialValue: current.len || '',
      })(<Input type="hidden" />)}

      {form.getFieldDecorator('fileType', {
        initialValue: current.fileType || '',
      })(<Input type="hidden" />)}

      {form.getFieldDecorator('url', {
        initialValue: current.url || '',
      })(<Input type="hidden" />)}

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="所属公司">
        {form.getFieldDecorator('company', {
          initialValue: current.advId ? { key: current.advId, label: current.companyName } : [],
          rules: [{ required: true, message: '请选择所属公司！' }],
        })(
          <Select
            showSearch
            placeholder="请选择所属公司"
            labelInValue
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={false}
            onSearch={debounce(fetchCompany, 800)}
            onChange={handleChange}
            style={{ width: '100%' }}
          >
            {companyData.map((d: any) => (
              <Option key={d.value} value={d.value}>
                {d.text}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="素材类型">
        {form.getFieldDecorator('type', {
          initialValue: current.type || 1,
          rules: [{ required: true, message: '请选择素材类型！' }],
        })(
          <Select placeholder="请选择素材类型" style={{ width: '100%' }}>
            <Option value={1}>效果素材</Option>
            <Option value={2}>源素材</Option>
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="素材上传">
        {form.getFieldDecorator('file', {
          initialValue: current.file || [],
          valuePropName: 'fileList',
          getValueFromEvent: normFile,
          rules: [{ required: true, message: '请上传图片！' }],
        })(
          <Upload {...uploadProps}>
            <Button>
              <Icon type="upload" /> 点击上传
            </Button>
          </Upload>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('remark', {
          initialValue: current.remark || '',
          rules: [{ required: false, message: '请输入备注！' }],
        })(<TextArea rows={4} placeholder="请输入备注" />)}
      </FormItem>
    </Modal>
  )
}

export default Form.create()(CreateForm)
