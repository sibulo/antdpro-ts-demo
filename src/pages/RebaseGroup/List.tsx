import * as React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Row, Col, Card, Form, Input, Button, Divider, Popconfirm, DatePicker, message } from 'antd'
import { routerRedux } from 'dva/router'
import { FormComponentProps } from 'antd/lib/form/Form'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import CreateForm from '@/pages/RebaseGroup/CreateForm.tsx'

import styles from './index.less'

const FormItem = Form.Item
const { RangePicker } = DatePicker

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

interface IFormComponentProps extends FormComponentProps {
  dispatch: IDispatch
  rebaseGroup: IRebaseGroupStore
  loading: boolean
}

interface IState {
  readonly modalVisible: boolean
  readonly selectedRows: []
  readonly formValues: any
  readonly current: any
}

export interface IFormField {
  id: number
  name: string
  createTime?: string
}

class RebaseGroupList extends React.PureComponent<IFormComponentProps, IState> {
  readonly state: IState = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    current: {},
  }

  columns = [
    {
      title: '托底广告组名称',
      dataIndex: 'name',
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: (text: string) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      render: (text: string) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text: string, record: IRebaseGroupModel) => (
        <React.Fragment>
          <a onClick={() => this.handleShowDetail(record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除?" onConfirm={() => this.handleRemove(record.id)}>
            <a>删除</a>
          </Popconfirm>
        </React.Fragment>
      ),
    },
  ]

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'rebaseGroup/fetch',
    })
  }

  navigatorTo = (path: string) => {
    const { dispatch } = this.props
    dispatch(routerRedux.push(path))
  }

  handleStandardTableChange = (pagination: IPagination, filtersArg, sorter) => {
    const { dispatch } = this.props
    const { formValues } = this.state

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
      type: 'rebaseGroup/fetch',
      payload: params,
    })
  }

  handleSelectRows = (rows: []) => {
    this.setState({
      selectedRows: rows,
    })
  }

  handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { dispatch, form } = this.props

    form.validateFields((err, fieldsValue) => {
      if (err) return

      let createTime

      if (fieldsValue.createTime) {
        if (fieldsValue.createTime[0] || fieldsValue.createTime[1]) {
          createTime = `${moment(fieldsValue.createTime[0]).format('YYYY-MM-DD')},${moment(
            fieldsValue.createTime[1]
          ).format('YYYY-MM-DD')}`
        }
      }

      const values = {
        ...fieldsValue,
        createTime,
      }

      this.setState({
        formValues: values,
      })

      dispatch({
        type: 'rebaseGroup/fetch',
        payload: values,
      })
    })
  }

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    })
  }

  handleAdd = (fields: IFormField) => {
    const { dispatch } = this.props
    dispatch({
      type: 'rebaseGroup/add',
      payload: {
        ...fields,
      },
      callback: () => {
        message.success('添加成功')
        dispatch({
          type: 'rebaseGroup/fetch',
        })
      },
    })

    this.handleModalVisible()
  }

  handleEdit = (fields: IFormField) => {
    const {
      dispatch,
      rebaseGroup: {
        data: { pagination },
      },
    } = this.props

    const { id } = fields

    dispatch({
      type: 'rebaseGroup/edit',
      payload: {
        id,
        params: fields,
      },
      callback: () => {
        message.success('修改成功')
        dispatch({
          type: 'rebaseGroup/fetch',
          payload: { ...pagination, currentPage: pagination.current },
        })
      },
    })
    this.handleModalVisible()
  }

  handleCreate() {
    this.setState({
      current: {},
    })
    this.handleModalVisible(true)
  }

  handleShowDetail(record: IRebaseGroupModel) {
    this.setState({
      current: record,
    })
    this.handleModalVisible(true)
  }

  handleRemove(id: number) {
    const {
      dispatch,
      rebaseGroup: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'rebaseGroup/remove',
      payload: {
        id,
      },
      callback: () => {
        dispatch({
          type: 'rebaseGroup/fetch',
          payload: {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
          },
        })
      },
    })
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="托底广告组名称">
              {getFieldDecorator('name')(
                <Input style={{ width: '100%' }} placeholder="请输入托底广告组名称" allowClear />
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

  render() {
    const {
      rebaseGroup: { data },
      loading,
    } = this.props

    const { selectedRows, modalVisible, current } = this.state

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
    }

    return (
      <PageHeaderWrapper title="托底广告组列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreate()}>
                新建
              </Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} current={current} />
      </PageHeaderWrapper>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  rebaseGroup: state.rebaseGroup,
  loading: state.loading.effects['rebaseGroup/fetch'],
})

export default connect(mapStateToProps)(Form.create()(RebaseGroupList))
