import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Row, Col, Card, Form, Button, message, Divider, Popconfirm, Input, DatePicker } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import CreateForm from '@/pages/PlaceType/CreateForm'

import styles from './index.less'

const FormItem = Form.Item
const { RangePicker } = DatePicker

const getValue = (obj: object) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

export interface IFormComponentProps extends FormComponentProps {
  dispatch: IDispatch
  placeType: IPlaceTypeStore
  loading: boolean
}

export interface IFormField {
  id: number
  name: string
}

const PlaceTypeList: React.SFC<IFormComponentProps> = props => {
  const {
    placeType: { data },
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
      type: 'placeType/fetch',
    })
  }, [])

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: 'Code',
      dataIndex: 'code',
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: (text: string, record: IPlaceTypeModel) => (
        <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text: string, record: IPlaceTypeModel) => (
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

    const params: any = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    }
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`
    }

    dispatch({
      type: 'placeType/fetch',
      payload: params,
    })
  }

  const handleSelectRows = (rows: []) => {
    setSelectedRows(rows)
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.validateFields((err, fieldsValue) => {
      if (err) return

      let createTime = ''

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
        type: 'placeType/fetch',
        payload: values,
      })
    })
  }

  const handleModalVisible = (flag?: boolean) => {
    setModalVisible(!!flag)
  }

  const handleAdd = (fields: IFormField) => {
    dispatch({
      type: 'placeType/add',
      payload: {
        ...fields,
      },
      callback: () => {
        message.success('添加成功')
        dispatch({
          type: 'placeType/fetch',
        })
      },
    })
    handleModalVisible()
  }

  const handleEdit = (fields: IFormField) => {
    const {
      placeType: {
        data: { pagination },
      },
    } = props

    const { id } = fields
    const params = fields
    delete params.id

    dispatch({
      type: 'placeType/edit',
      payload: {
        id,
        params,
      },
      callback: () => {
        message.success('修改成功')
        dispatch({
          type: 'placeType/fetch',
          payload: { ...pagination, currentPage: pagination.current },
        })
      },
    })
    handleModalVisible()
  }

  const handleCreate = () => {
    setCurrent({})
    handleModalVisible(true)
  }

  const handleShowDetail = (record: IPlaceTypeModel) => {
    setCurrent({
      ...record,
    })
    handleModalVisible(true)
  }

  const handleRemove = (id: number) => {
    const {
      placeType: {
        data: { pagination },
      },
    } = props
    dispatch({
      type: 'placeType/remove',
      payload: {
        id,
      },
      callback: () => {
        dispatch({
          type: 'placeType/fetch',
          payload: {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
          },
        })
      },
    })
  }

  const renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = props
    return (
      <Form onSubmit={handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入广告位类型名称" style={{ width: '100%' }} allowClear />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
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
    <PageHeaderWrapper title="广告位类型列表">
      <Card bordered={false}>
        <div className={styles.tableList}>
          {/* <div className={styles.tableListForm}>{renderForm()}</div> */}
          {/* <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={() => handleCreate()}>
              新建
            </Button>
          </div> */}
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
  placeType: state.placeType,
  loading: state.loading.effects['placeType/fetch'],
})

export default connect(mapStateToProps)(Form.create()(PlaceTypeList))
