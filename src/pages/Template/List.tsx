import * as React from 'react'
import { connect } from 'dva'
import { Row, Col, Card, Form, Input, Button, message } from 'antd'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import { FormComponentProps } from 'antd/lib/form/Form'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'

import styles from './index.less'

const FormItem = Form.Item

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

export interface IFormComponentProps extends FormComponentProps {
  dispatch: IDispatch
  template: ITemplateStore
  loading: boolean
}

export interface IState {
  readonly selectedRows: string[]
  readonly formValues: object
}

export interface IFormField {
  id: number
  name: string
  placeTypeId: number
  html: string
  js: string
  css: string
  createTime?: string
  updatedAt?: string
}

class TemplateList extends React.PureComponent<IFormComponentProps, IState> {
  readonly state: IState = {
    selectedRows: [],
    formValues: {},
  }

  columns = [
    {
      title: '模板名称',
      dataIndex: 'name',
    },
    {
      title: '广告位类型',
      dataIndex: 'placeTypeName',
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
      render: (text: string, record: ITemplateModel) => (
        <React.Fragment>
          <a onClick={() => this.handleEdit(record)}>编辑</a>
          {/* <Divider type="vertical" />
          <Popconfirm title="确定删除?" onConfirm={() => this.handleRemove(record.id)}>
            <a>删除</a>
          </Popconfirm> */}
        </React.Fragment>
      ),
    },
  ]

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'template/fetch',
    })
  }

  navigatorTo = (path: string) => {
    const { dispatch } = this.props
    dispatch(routerRedux.push(path))
  }

  handleStandardTableChange = (pagination: IPagination, filtersArg: any, sorter: any) => {
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

    dispatch({
      type: 'template/fetch',
      payload: params,
    })
  }

  handleSelectRows = (rows: string[]) => {
    this.setState({
      selectedRows: rows,
    })
  }

  handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { dispatch, form } = this.props

    form.validateFields((err: any, fieldsValue: IFormField) => {
      if (err) return

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      }

      this.setState({
        formValues: values,
      })

      dispatch({
        type: 'template/fetch',
        payload: values,
      })
    })
  }

  handleEdit = (record: ITemplateModel) => {
    this.navigatorTo(`/template/edit/${record.id}`)
  }

  handleCreate = () => {
    this.navigatorTo('/template/create')
  }

  handleRemove(id: number) {
    const {
      dispatch,
      template: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'template/remove',
      payload: {
        id,
      },
      callback: () => {
        message.success('删除成功')
        dispatch({
          type: 'template/fetch',
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
            <FormItem label="模板名称">
              {getFieldDecorator('name')(
                <Input style={{ width: '100%' }} placeholder="请输入模板名称" allowClear />
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
      template: { data },
      loading,
    } = this.props
    const { selectedRows } = this.state

    return (
      <PageHeaderWrapper title="基础模板列表">
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
      </PageHeaderWrapper>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  template: state.template,
  loading: state.loading.effects['rebaseGroup/fetch'],
})

export default connect(mapStateToProps)(Form.create()(TemplateList))
