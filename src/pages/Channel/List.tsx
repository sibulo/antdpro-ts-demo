import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import {
  Row,
  Col,
  Card,
  Form,
  Select,
  Button,
  message,
  Divider,
  Popconfirm,
  Input,
  DatePicker,
} from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import CreateForm from '@/pages/Channel/CreateForm'

import styles from './index.less'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Option } = Select

const getValue = (obj: object) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

export interface IFormComponentProps extends FormComponentProps {
  dispatch: IDispatch
  match: any
  media: IMediaStore
  channel: IChannelStore
  loading: boolean
}

export interface IFormField {
  id: number
  mediaId: number
  name: string
  createTime?: string
}

const ChannelList: React.SFC<IFormComponentProps> = props => {
  const {
    channel: { data },
    media,
    loading,
    dispatch,
    form,
    match,
  } = props

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [formValues, setFormValues] = useState({})
  const [current, setCurrent] = useState({})

  useEffect(() => {
    if (match.params.id) {
      dispatch({
        type: 'channel/fetch',
        payload: {
          mediaId: match.params.id,
        },
      })
    } else {
      dispatch({
        type: 'channel/fetch',
      })
    }
    dispatch({
      type: 'media/fetch',
      payload: {
        currentPage: 1,
        pageSize: 9999,
      },
    })
  }, [])

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '所属媒体',
      dataIndex: 'mediaName',
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: (text: string, record: IChannelModel) => (
        <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text: string, record: IChannelModel) => (
        <React.Fragment>
          <a onClick={() => handleShowDetail(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除?" onConfirm={() => handleRemove(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </React.Fragment>
      ),
    },
  ]

  const handleStandardTableChange = (pagination: IPagination, filtersArg: any, sorter: any) => {
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj }
      newObj[key] = getValue(filtersArg[key])
      return newObj
    }, {})

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    }
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`
    }

    if (match.params.id) {
      dispatch({
        type: 'channel/fetch',
        payload: {
          ...params,
          mediaId: match.params.id,
        },
      })
    } else {
      dispatch({
        type: 'channel/fetch',
        payload: params,
      })
    }
  }

  const handleSelectRows = (rows: []) => {
    setSelectedRows(rows)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.validateFields((err, fieldsValue: IFormField) => {
      if (err) return

      let createTime

      if (fieldsValue.createTime) {
        if (fieldsValue.createTime && (fieldsValue.createTime[0] || fieldsValue.createTime[1])) {
          createTime = `${moment(fieldsValue.createTime[0]).format('YYYY-MM-DD')},${moment(
            fieldsValue.createTime[1]
          ).format('YYYY-MM-DD')}`
        }
      }

      const values = {
        ...fieldsValue,
        createTime,
      }

      setFormValues(values)

      if (match.params.id) {
        dispatch({
          type: 'channel/fetch',
          payload: {
            ...values,
            mediaId: match.params.id,
          },
        })
      } else {
        dispatch({
          type: 'channel/fetch',
          payload: values,
        })
      }
    })
  }

  const handleModalVisible = (flag?: boolean) => {
    setModalVisible(!!flag)
  }

  const handleAdd = (fields: IFormField) => {
    dispatch({
      type: 'channel/add',
      payload: {
        ...fields,
      },
      callback: () => {
        message.success('添加成功')
        if (match.params.id) {
          dispatch({
            type: 'channel/fetch',
            payload: {
              mediaId: match.params.id,
            },
          })
        } else {
          dispatch({
            type: 'channel/fetch',
          })
        }
      },
    })
    handleModalVisible()
  }

  const handleEdit = (fields: IFormField) => {
    const {
      channel: {
        data: { pagination },
      },
    } = props

    const { id } = fields

    dispatch({
      type: 'channel/edit',
      payload: {
        id,
        params: fields,
      },
      callback: () => {
        message.success('修改成功')
        if (match.params.id) {
          dispatch({
            type: 'channel/fetch',
            payload: {
              ...formValues,
              ...pagination,
              currentPage: pagination.current,
              mediaId: match.params.id,
            },
          })
        } else {
          dispatch({
            type: 'channel/fetch',
            payload: { ...formValues, ...pagination, currentPage: pagination.current },
          })
        }
      },
    })
    handleModalVisible()
  }

  const handleCreate = () => {
    setCurrent({ mediaId: match.params.id ? parseInt(match.params.id, 10) : [] })
    handleModalVisible(true)
  }

  const handleShowDetail = (record: IChannelModel) => {
    setCurrent({
      ...record,
      mediaId: match.params.id ? parseInt(match.params.id, 10) : record.mediaId,
    })
    handleModalVisible(true)
  }

  const handleRemove = (id: number) => {
    const {
      channel: {
        data: { pagination },
      },
    } = props
    dispatch({
      type: 'channel/remove',
      payload: {
        id,
      },
      callback: () => {
        if (match.params.id) {
          dispatch({
            type: 'channel/fetch',
            payload: {
              ...formValues,
              currentPage: pagination.current,
              pageSize: pagination.pageSize,
              mediaId: match.params.id,
            },
          })
        } else {
          dispatch({
            type: 'channel/fetch',
            payload: {
              ...formValues,
              currentPage: pagination.current,
              pageSize: pagination.pageSize,
            },
          })
        }
      },
    })
  }

  const renderForm = () => {
    const {
      form: { getFieldDecorator },
      media: { data },
    } = props
    return (
      <Form onSubmit={handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="媒体">
              {getFieldDecorator('mediaId')(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择媒体"
                  style={{ width: '100%' }}
                  allowClear
                >
                  {data.list.map(x => (
                    <Option key={x.id} value={x.id}>
                      {x.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入频道名称" style={{ width: '100%' }} allowClear />
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="添加时间">
              {getFieldDecorator('createTime')(
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['请选择开始时间', '请选择结束时间']}
                />
              )}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    )
  }

  const mediaList = media.data.list

  const parentMethods = {
    handleAdd,
    handleEdit,
    handleModalVisible,
  }

  return (
    <PageHeaderWrapper title="频道列表">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => handleCreate()}>
              新建
            </Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            onSelectRow={handleSelectRows}
            onChange={handleStandardTableChange}
          />
        </div>
      </Card>
      <CreateForm
        {...parentMethods}
        modalVisible={modalVisible}
        current={current}
        mediaList={mediaList}
      />
    </PageHeaderWrapper>
  )
}

const mapStateToProps = (state: IStore) => ({
  channel: state.channel,
  media: state.media,
  loading: state.loading.effects['channel/fetch'],
})

export default connect(mapStateToProps)(Form.create()(ChannelList))
