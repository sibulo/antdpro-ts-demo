import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Row, Col, Card, Form, Button, message, Divider, Popconfirm, Input, DatePicker } from 'antd'
import { routerRedux } from 'dva/router'
import { FormComponentProps } from 'antd/lib/form/Form'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import CreateForm from '@/pages/Media/CreateForm'

import styles from './index.less'

const FormItem = Form.Item
const { RangePicker } = DatePicker

const getValue = (obj: object) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

export interface IFormComponentProps extends FormComponentProps {
  dispatch: IDispatch
  media: IMediaStore
  loading: boolean
}

export interface IFormField {
  id: number
  name: string
  createTime?: string
}

const MediaList: React.SFC<IFormComponentProps> = props => {
  const {
    media: { data },
    loading,
    dispatch,
    form,
  } = props

  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const [formValues, setFormValues] = useState({})
  const [current, setCurrent] = useState({})

  useEffect(() => {
    dispatch({
      type: 'media/fetch',
    })
  }, [])

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: (text: string, record: IMediaModel) => (
        <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text: string, record: IMediaModel) => (
        <React.Fragment>
          <a onClick={() => handleShowDetail(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除?" onConfirm={() => handleRemove(record.id)}>
            <a>删除</a>
          </Popconfirm>
          <Divider type="vertical" />
          <a onClick={() => navigatorTo(`/common/${record.id}/channel/list`)}>频道</a>
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

    dispatch({
      type: 'media/fetch',
      payload: params,
    })
  }

  const handleSelectRows = (rows: []) => {
    setSelectedRows(rows)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.validateFields((err: any, fieldsValue: IFormField) => {
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

      dispatch({
        type: 'media/fetch',
        payload: values,
      })
    })
  }

  const handleModalVisible = (flag?: boolean) => {
    setModalVisible(!!flag)
  }

  const handleAdd = (fields: IFormField) => {
    dispatch({
      type: 'media/add',
      payload: {
        ...fields,
      },
      callback: () => {
        message.success('添加成功')
        dispatch({
          type: 'media/fetch',
        })
      },
    })

    handleModalVisible()
  }

  const handleEdit = (fields: IFormField) => {
    const {
      media: {
        data: { pagination },
      },
    } = props

    const { id } = fields

    dispatch({
      type: 'media/edit',
      payload: {
        id,
        params: fields,
      },
      callback: () => {
        message.success('修改成功')
        dispatch({
          type: 'media/fetch',
          payload: { ...formValues, ...pagination, currentPage: pagination.current },
        })
      },
    })
    handleModalVisible()
  }

  const handleCreate = () => {
    setCurrent({})
    handleModalVisible(true)
  }

  const handleShowDetail = (record: IMediaModel) => {
    setCurrent({ ...record })
    handleModalVisible(true)
  }

  const handleRemove = (id: number) => {
    const {
      media: {
        data: { pagination },
      },
    } = props

    dispatch({
      type: 'media/remove',
      payload: {
        id,
      },
      callback: () => {
        dispatch({
          type: 'media/fetch',
          payload: {
            ...formValues,
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
          },
        })
      },
    })
  }

  const navigatorTo = (path: string) => {
    dispatch(routerRedux.push(path))
  }

  const renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = props
    return (
      <Form onSubmit={handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入媒体名称" style={{ width: '100%' }} allowClear />
              )}
            </FormItem>
          </Col>
          <Col md={10} sm={24}>
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

  const parentMethods = {
    handleAdd,
    handleEdit,
    handleModalVisible,
  }

  return (
    <PageHeaderWrapper title="媒体列表">
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
      <CreateForm {...parentMethods} modalVisible={modalVisible} current={current} />
    </PageHeaderWrapper>
  )
}

const mapStateToProps = (state: IStore) => ({
  media: state.media,
  loading: state.loading.effects['media/fetch'],
})

export default connect(mapStateToProps)(Form.create()(MediaList))
