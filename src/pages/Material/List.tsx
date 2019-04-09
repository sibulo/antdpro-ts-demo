import * as React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  message,
  Divider,
  Popconfirm,
  DatePicker,
} from 'antd'
import Zmage from 'react-zmage'
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import CreateForm from '@/pages/Material/CreateForm'

import styles from './List.less'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker

const getValue = (obj: object) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

const EditableContext = React.createContext({})

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, ...restProps }) => (
  <EditableContext.Consumer>
    {(form: any) => {
      const { getFieldDecorator } = form
      return (
        <td {...restProps}>
          {editing ? (
            <FormItem style={{ margin: 0 }}>
              {getFieldDecorator(dataIndex, {
                rules: [
                  {
                    required: true,
                    message: `请输入${title}!`,
                  },
                ],
                initialValue: record[dataIndex],
              })(<Input placeholder={`请输入${title}!`} />)}
            </FormItem>
          ) : (
            restProps.children
          )}
        </td>
      )
    }}
  </EditableContext.Consumer>
)

interface IFormComponentProps extends FormComponentProps {
  dispatch: IDispatch
  material: IMaterialStore
  loading: boolean
}

interface IState {
  readonly modalVisible: boolean
  readonly selectedRows: string[]
  readonly formValues: object
  readonly editingKey: string | number
  readonly current: object
}

class MaterialList extends React.PureComponent<IFormComponentProps, IState> {
  readonly state: IState = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
    editingKey: '',
    current: {},
  }

  columns = [
    {
      title: '素材名称',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '素材类型',
      dataIndex: 'type',
      render: (text: any) => <span>{text === 1 ? '效果素材' : '源素材'}</span>,
    },
    {
      title: '所属公司',
      dataIndex: 'companyName',
    },
    {
      title: '缩略图',
      dataIndex: 'url',
      render: (text: any, record: IMaterialModel) => {
        const t = record.fileType ? record.fileType.split('/')[0] : ''
        if (t === 'image') {
          return (
            <Zmage
              src={`${text}?x-oss-process=image/resize,m_lfit,h_100,w_200`}
              alt={record.name}
              set={[
                {
                  src: text,
                  alt: record.name,
                },
              ]}
            />
          )
        }
        return (
          <img
            src={`https://via.placeholder.com/200x100?text=${record.fileType}`}
            alt={record.name}
          />
        )
      },
    },
    {
      title: '图片尺寸',
      dataIndex: 'imageWH',
      render: (text: any, record: IMaterialModel) => {
        const t = record.fileType ? record.fileType.split('/')[0] : ''
        if (t === 'image' && record.height && record.width) {
          return <span>{`${record.width}X${record.height}`}</span>
        }
        return <span>无</span>
      },
    },
    {
      title: '文件大小',
      dataIndex: 'len',
      render: (text: any) => <span>{(text / 1024).toFixed()}KB</span>,
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: (text: any) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '添加人',
      dataIndex: 'createUserName',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text: any, record: IMaterialModel) => {
        const editable = this.isEditing(record)
        return (
          <React.Fragment>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {(form: any) => (
                    <a onClick={() => this.handleSave(form, record.id)} style={{ marginRight: 8 }}>
                      保存
                    </a>
                  )}
                </EditableContext.Consumer>
                <Popconfirm title="确定取消?" onConfirm={() => this.handleCancel()}>
                  <a>取消</a>
                </Popconfirm>
              </span>
            ) : (
              <a onClick={() => this.handleEditName(record.id)}>编辑名称</a>
            )}
            <Divider type="vertical" />
            <a onClick={() => this.handleShowDetail(record)}>修改</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除?" onConfirm={() => this.handleRemove(record)}>
              <a>删除</a>
            </Popconfirm>
            <Divider type="vertical" />
            <a href={record.url} target="_blank" download={record.name}>
              下载
            </a>
          </React.Fragment>
        )
      },
    },
  ]

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'material/fetch',
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

    dispatch({
      type: 'material/fetch',
      payload: params,
    })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props
    form.resetFields()
    this.setState({
      formValues: {},
    })
    dispatch({
      type: 'material/fetch',
      payload: {},
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

    form.validateFields((err: any, fieldsValue: any) => {
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
        [fieldsValue.contentType]: fieldsValue.content,
      }

      delete values.content
      delete values.contentType

      this.setState({
        formValues: values,
      })

      dispatch({
        type: 'material/fetch',
        payload: values,
      })
    })
  }

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    })
  }

  handleAdd = (fields: any) => {
    const { dispatch } = this.props
    dispatch({
      type: 'material/add',
      payload: {
        ...fields,
      },
      callback: () => {
        message.success('添加成功')
        dispatch({
          type: 'material/fetch',
        })
      },
    })
    this.handleModalVisible()
  }

  handleEdit = (fields: any) => {
    const {
      dispatch,
      material: {
        data: { pagination },
      },
    } = this.props

    const { id } = fields

    dispatch({
      type: 'material/update',
      payload: {
        id,
        params: fields,
      },
      callback: () => {
        dispatch({
          type: 'material/fetch',
          payload: { pageSize: pagination.pageSize, currentPage: pagination.current },
        })
      },
    })
    this.handleModalVisible()
  }

  handleCancel = () => {
    this.setState({ editingKey: '' })
  }

  isEditing = (record: IMaterialModel) => {
    const { editingKey } = this.state
    return record.id === editingKey
  }

  handleSave(form: WrappedFormUtils, id: number) {
    const { dispatch } = this.props
    form.validateFields((error: any, row: any) => {
      if (error) {
        return
      }
      dispatch({
        type: 'material/updateByName',
        payload: { id, params: { id, ...row } },
        callback: () => {
          message.success('修改成功')
        },
      })
      this.setState({ editingKey: '' })
    })
  }

  handleEditName(key: number) {
    this.setState({ editingKey: key })
  }

  handleCreate() {
    this.setState({
      current: {},
    })
    this.handleModalVisible(true)
  }

  handleShowDetail(record: IMaterialModel) {
    this.setState({
      current: {
        ...record,
        file: [
          {
            uid: -1,
            name: record.name,
            status: 'done',
            url: record.url,
          },
        ],
      },
    })
    this.handleModalVisible(true)
  }

  handleRemove(record: IMaterialModel) {
    const {
      dispatch,
      material: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'material/remove',
      payload: {
        id: record.id,
        name: record.url.replace('http://dfws-file.veimg.cn/', ''),
      },
      callback: () => {
        message.success('移除成功')
        dispatch({
          type: 'material/fetch',
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
    const prefixSelector = getFieldDecorator('contentType', {
      initialValue: 'companyName',
    })(
      <Select style={{ width: 100 }}>
        <Option value="companyName">公司名称</Option>
        <Option value="creatorName">添加人</Option>
        <Option value="advId">公司ID</Option>
        <Option value="remark">备注</Option>
        <Option value="name">素材名称</Option>
      </Select>
    )
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('content')(
                <Input
                  placeholder="请输入搜索内容"
                  addonBefore={prefixSelector}
                  style={{ width: '100%' }}
                  allowClear
                />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="素材类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择素材类型" style={{ width: '100%' }} allowClear>
                  <Option value="1">效果素材</Option>
                  <Option value="2">源素材</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="添加时间">
              {getFieldDecorator('createTime', {})(
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
      material: { data },
      loading,
    } = this.props
    const { selectedRows, modalVisible, current } = this.state

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleEdit: this.handleEdit,
      handleModalVisible: this.handleModalVisible,
    }

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    }

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col
      }
      return {
        ...col,
        onCell: record => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      }
    })

    return (
      <PageHeaderWrapper title="素材列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleCreate()}>
                新建
              </Button>
            </div>
            <StandardTable
              components={components}
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              rowClassName="editable-row"
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
  material: state.material,
  loading: state.loading.effects['material/fetch'],
})

export default connect(mapStateToProps)(Form.create()(MaterialList))
