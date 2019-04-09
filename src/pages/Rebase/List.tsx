import * as React from 'react'
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
import Zmage from 'react-zmage'
import { FormComponentProps } from 'antd/lib/form/Form'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import CreateForm from '@/pages/Rebase/CreateForm'

import styles from './index.less'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const { Option } = Select

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

export interface IFormComponentProps extends FormComponentProps {
  dispatch: IDispatch
  match: any
  rebase: IRebaseStore
  loading: boolean
  location: any
}

export interface IState {
  readonly modalVisible: boolean
  readonly selectedRows: []
  readonly formValues: any
  readonly current: any
  readonly rebaseGroupList: []
}

export interface IFormField {
  id: number
  materialId: string
  materialUrl: string
  groupId: number
  linkUrl: string
  name: string
  createTime?: string
  selected?: number
}

class RebaseList extends React.PureComponent<IFormComponentProps, IState> {
  readonly state: IState = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    current: {},
    rebaseGroupList: [],
  }

  columns = [
    {
      title: '托底广告名称',
      dataIndex: 'name',
    },
    {
      title: '托底广告图片',
      dataIndex: 'materialUrl',
      render: (text: string, record: IRebaseModel) => (
        <Zmage
          src={`${text}?x-oss-process=image/resize,m_lfit,h_100,w_200`}
          alt={record.name}
          set={[
            {
              src: record.materialUrl,
              alt: record.materialName,
            },
          ]}
        />
      ),
    },
    {
      title: '托底广告链接',
      dataIndex: 'linkUrl',
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: (text: string, record: IRebaseModel) => (
        <span>{moment(record.createTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      ),
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text: string, record: IRebaseModel) => (
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
    const { dispatch, match, location } = this.props
    if (match.params.id) {
      dispatch({
        type: 'rebase/fetch',
        payload: {
          groupId: match.params.id,
        },
      })
    } else {
      dispatch({
        type: 'rebase/fetch',
      })
    }
    if (location.state) {
      this.setState({
        modalVisible: true,
        current: {
          materialId: location.state!.material.id,
          materialUrl: location.state!.material.url,
        },
      })
    }
    dispatch({
      type: 'rebaseGroup/fetch',
      payload: {
        currentPage: 1,
        pageSize: 999,
      },
      callback: res => {
        this.setState({
          rebaseGroupList: res.data.list,
        })
      },
    })
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
      type: 'rebase/fetch',
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
        type: 'rebase/fetch',
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
      type: 'rebase/add',
      payload: {
        ...fields,
      },
      callback: () => {
        message.success('添加成功')
        dispatch({
          type: 'rebase/fetch',
        })
      },
    })

    this.handleModalVisible()
  }

  handleEdit = (fields: IFormField) => {
    const {
      dispatch,
      rebase: {
        data: { pagination },
      },
    } = this.props

    const { id } = fields

    dispatch({
      type: 'rebase/edit',
      payload: {
        id,
        params: fields,
      },
      callback: () => {
        message.success('修改成功')
        dispatch({
          type: 'rebase/fetch',
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

  handleShowDetail(record: IRebaseModel) {
    this.setState({
      current: {
        ...record,
      },
    })
    this.handleModalVisible(true)
  }

  handleRemove(id: number) {
    const {
      dispatch,
      rebase: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'rebase/remove',
      payload: {
        id,
      },
      callback: () => {
        dispatch({
          type: 'rebase/fetch',
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
    const { rebaseGroupList } = this.state
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="托底广告组">
              {getFieldDecorator('groupId')(
                <Select
                  showSearch
                  optionFilterProp="children"
                  placeholder="请选择托底广告组"
                  style={{ width: '100%' }}
                  allowClear
                >
                  {rebaseGroupList.map((x: any) => (
                    <Option key={x.id} value={x.id}>
                      {x.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="托底广告名称">
              {getFieldDecorator('name')(
                <Input placeholder="请输入托底广告名称" style={{ width: '100%' }} allowClear />
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

  render() {
    const {
      rebase: { data },
      loading,
    } = this.props
    const { selectedRows, modalVisible, current, rebaseGroupList } = this.state

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
    }

    return (
      <PageHeaderWrapper title="托底广告列表">
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
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          current={current}
          rebaseGroupList={rebaseGroupList}
        />
      </PageHeaderWrapper>
    )
  }
}

const mapStateToProps = (state: IStore) => ({
  rebase: state.rebase,
  loading: state.loading.effects['rebase/fetch'],
})

export default connect(mapStateToProps)(Form.create()(RebaseList))
