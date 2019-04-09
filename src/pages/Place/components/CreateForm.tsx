import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { Row, Col, Form, Input, InputNumber, Select, Button, Modal } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import styles from '../List.less'

const FormItem = Form.Item
const { Option } = Select

interface IFormComponentProps extends FormComponentProps {
  dispatch: any
  modalVisible: boolean
  formData: any
  currentAction: any
  current: any
  mediaList: []
  handleAdd: (arg: any) => void
  handleModalVisible: () => void
  handleTypeChange: (arg: any, arg2: any) => void
}

interface IState {
  readonly channelList: []
  readonly templateList: []
  readonly rebaseList: []
  readonly rebaseGroupList: []
}

const CreateForm: React.SFC<IFormComponentProps> = props => {
  const [channelList, setChannelList] = useState([])
  const [templateList, setTemplateList] = useState([])
  const [rebaseGroupList, setRebaseGroupList] = useState([])
  const [rebaseList, setRebaseList] = useState([])

  useEffect(() => {
    const { dispatch, currentAction, current } = props
    if (currentAction === 'show') {
      dispatch({
        type: 'channel/fetch',
        payload: {
          mediaId: current.mediaId,
          currentPage: 1,
          pageSize: 999,
        },
        callback: res => {
          setChannelList(res.data.list)
        },
      })
    }
  }, [props.currentAction])

  useEffect(() => {
    const { dispatch } = props
    dispatch({
      type: 'template/fetch',
      payload: {
        currentPage: 1,
        pageSize: 999,
      },
      callback: res => {
        setTemplateList(res.data.list)
      },
    })
    dispatch({
      type: 'rebaseGroup/fetch',
      payload: {
        currentPage: 1,
        pageSize: 999,
      },
      callback: res => {
        setRebaseGroupList(res.data.list)
      },
    })
    dispatch({
      type: 'rebase/fetch',
      payload: {
        currentPage: 1,
        pageSize: 999,
      },
      callback: res => {
        setRebaseList(res.data.list)
      },
    })
  }, [])

  const {
    modalVisible,
    form,
    handleAdd,
    handleModalVisible,
    handleTypeChange,
    formData,
    currentAction,
    current,
    mediaList,
  } = props

  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      form.resetFields()
      handleAdd(fieldsValue)
    })
  }

  const changeHandle = value => {
    const temp = templateList.filter(x => x.id === value)[0]
    handleTypeChange(form, temp)
  }

  const handleMediaChange = value => {
    const { dispatch } = props
    dispatch({
      type: 'channel/fetch',
      payload: {
        mediaId: value,
        currentPage: 1,
        pageSize: 999,
      },
      callback: res => {
        setChannelList(res.data.list)
      },
    })
  }

  return (
    <Modal
      destroyOnClose
      title={currentAction === 'show' ? '广告位详情' : '新建广告位'}
      visible={modalVisible}
      maskClosable={false}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
      footer={
        currentAction === 'create'
          ? [
            <Button key="back" onClick={() => handleModalVisible()}>
                取消
            </Button>,
            <Button key="submit" type="primary" onClick={okHandle}>
                确定
            </Button>,
            ]
          : [
            <Button key="back" onClick={() => handleModalVisible()}>
                关闭
            </Button>,
            ]
      }
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模板名称">
        {form.getFieldDecorator('templateId', {
          initialValue: current.templateId || [],
          rules: [{ required: true, message: '请选择模板名称！' }],
        })(
          <Select
            disabled={currentAction === 'show'}
            placeholder="请选择模板名称"
            style={{ width: '100%' }}
            onChange={value => changeHandle(value)}
          >
            {templateList.map((x: any) => (
              <Option key={x.id} value={x.id}>
                {x.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="媒体">
        {form.getFieldDecorator('mediaId', {
          initialValue: current.mediaId || [],
          rules: [{ required: true, message: '请选择媒体！' }],
        })(
          <Select
            disabled={currentAction === 'show'}
            placeholder="请选择媒体"
            style={{ width: '100%' }}
            onChange={handleMediaChange}
          >
            {mediaList.map((x: any) => (
              <Option key={x.id} value={x.id}>
                {x.name}
              </Option>
            ))}
          </Select>
        )}
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="频道">
        {form.getFieldDecorator('channelId', {
          initialValue: current.channelId || [],
          rules: [{ required: true, message: '请选择频道！' }],
        })(
          <Select
            disabled={currentAction === 'show'}
            placeholder="请选择频道"
            style={{ width: '100%' }}
          >
            {channelList.map((x: any) => (
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
          rules: [{ required: true, whitespace: true, message: '请输入位置名称！' }],
        })(<Input disabled={currentAction === 'show'} placeholder="请输入位置名称" />)}
      </FormItem>

      <FormItem required labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="单位尺寸">
        <Row>
          <Col span={11} className={styles['override-ant-form-item']}>
            <FormItem>
              {form.getFieldDecorator('height', {
                initialValue: current.height || '',
                rules: [{ required: true, message: '请输入高度！' }],
              })(
                <InputNumber
                  disabled={currentAction === 'show'}
                  placeholder="请输入高度"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
          <Col span={2}>
            <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>x</span>
          </Col>
          <Col span={11} className={styles['override-ant-form-item']}>
            <FormItem>
              {form.getFieldDecorator('width', {
                initialValue: current.width || '',
                rules: [{ required: true, message: '请输入宽度！' }],
              })(
                <InputNumber
                  disabled={currentAction === 'show'}
                  placeholder="请输入宽度"
                  style={{ width: '100%' }}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </FormItem>

      <FormItem required labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="行列限制">
        <Col span={11} className={styles['override-ant-form-item']}>
          <FormItem>
            {form.getFieldDecorator('rowNum', {
              initialValue:
                current.rowNum ||
                (formData.code === 'NORMAL' || formData.code === 'CAROUSEL' ? 1 : ''),
              rules: [{ required: true, message: '请输入行数！' }],
            })(
              <InputNumber
                disabled={
                  currentAction === 'show' ||
                  formData.code === 'NORMAL' ||
                  formData.code === 'CAROUSEL'
                }
                placeholder="请输入行数"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
        </Col>
        <Col span={2}>
          <span style={{ display: 'inline-block', width: '100%', textAlign: 'center' }}>x</span>
        </Col>
        <Col span={11} className={styles['override-ant-form-item']}>
          <FormItem>
            {form.getFieldDecorator('colNum', {
              initialValue:
                current.colNum ||
                (formData.code === 'NORMAL' || formData.code === 'CAROUSEL' ? 1 : ''),
              rules: [{ required: true, message: '请输入列数！' }],
            })(
              <InputNumber
                disabled={currentAction === 'show' || formData.code === 'NORMAL'}
                placeholder="请输入列数"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
        </Col>
      </FormItem>

      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="托底策略">
        {form.getFieldDecorator('rebaseType', {
          initialValue: current.rebaseType || 1,
          rules: [{ required: true, message: '请选择托底策略！' }],
        })(
          <Select
            disabled={currentAction === 'show'}
            placeholder="请选择托底策略"
            style={{ width: '100%' }}
          >
            <Option value={1}>保持原状</Option>
            <Option value={2}>不托底</Option>
            <Option value={3}>托底广告</Option>
            <Option value={4}>托底广告组</Option>
          </Select>
        )}
      </FormItem>

      {(form.getFieldValue('rebaseType') !== 2 || current.rebaseType !== 2) &&
        (formData.code === 'CAROUSEL' || current.placeTypeCode === 'CAROUSEL') && (
          <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="最小广告数">
            {form.getFieldDecorator('min', {
              initialValue: current.min || 1,
            })(
              <InputNumber
                disabled={currentAction === 'show'}
                placeholder="请输入最小广告数"
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
        )}

      {(form.getFieldValue('rebaseType') === 3 || current.rebaseType === 3) && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="托底广告">
          {form.getFieldDecorator('rebaseValue', {
            initialValue: current.rebaseValue || [],
          })(
            <Select
              showSearch
              optionFilterProp="children"
              disabled={currentAction === 'show'}
              placeholder="请选择托底广告"
              style={{ width: '100%' }}
            >
              {rebaseList.map((x: any) => (
                <Option key={x.id} value={x.id}>
                  {x.name}
                </Option>
              ))}
            </Select>
          )}
        </FormItem>
      )}

      {(form.getFieldValue('rebaseType') === 4 || current.rebaseType === 4) && (
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="托底广告组">
          {form.getFieldDecorator('rebaseValue', {
            initialValue: current.rebaseValue || [],
          })(
            <Select
              showSearch
              optionFilterProp="children"
              disabled={currentAction === 'show'}
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
      )}
    </Modal>
  )
}

export default connect()(Form.create()(CreateForm))
