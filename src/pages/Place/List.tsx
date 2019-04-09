import * as React from 'react'
import { connect } from 'dva'
import moment from 'moment'
import { Row, Col, Card, Form, Input, Select, Button, message, Divider, Popconfirm } from 'antd'
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import CreateForm from '@/pages/Place/components/CreateForm'
import CreateTemplate from '@/pages/Place/components/CreateTemplate'
import FormatModal from '@/pages/Place/components/FormatModal'
import PreviewPlace from '@/pages/Place/components/PreviewPlace'
import BuildCode from '@/pages/Place/components/BuildCode'

import styles from './List.less'

const FormItem = Form.Item
const { Option } = Select

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

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  ...restProps
}: {
  dataIndex: string
  [propName: string]: any
}) => (
  <EditableContext.Consumer>
    {(form: WrappedFormUtils) => {
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
  dispatch: any
  place: any
  loading: boolean
}

interface IState {
  readonly modalVisible: boolean
  readonly modalFormatVisible: boolean
  readonly modalTemplateVisible: boolean
  readonly modalBuildCodeVisible: boolean
  readonly modalPreviewVisible: boolean
  readonly selectedRows: string[]
  readonly formValues: any
  readonly editingKey: string
  readonly formData: any
  readonly currentId: number
  readonly currentType: number
  readonly currentTypeCode: string
  readonly currentCells: any
  readonly currentAction: string
  readonly current: any
  readonly mediaList: []
  readonly channelList: []
  readonly template: string
  readonly previews: string
}

class PlaceList extends React.PureComponent<IFormComponentProps, IState> {
  readonly state: IState = {
    modalVisible: false,
    modalFormatVisible: false,
    modalTemplateVisible: false,
    modalBuildCodeVisible: false,
    modalPreviewVisible: false,
    selectedRows: [],
    formValues: {},
    editingKey: '',
    formData: {
      type: 0,
    },
    currentId: 0,
    currentType: 0,
    currentTypeCode: '',
    currentCells: null,
    currentAction: 'create',
    current: {},
    mediaList: [],
    channelList: [],
    template: '',
    previews: '',
  }

  cellGridState = {
    deleteRow: '',
    rowNum: 0,
  }

  cellColState = {
    colNum: 0,
  }

  columns = [
    {
      title: '广告位编号',
      dataIndex: 'code',
    },
    {
      title: '广告位名称',
      dataIndex: 'name',
      editable: true,
    },
    {
      title: '所属频道',
      dataIndex: 'channelName',
    },
    {
      title: '所属媒体',
      dataIndex: 'mediaName',
    },
    {
      title: '广告位类型',
      dataIndex: 'placeTypeName',
    },
    {
      title: '行列限制',
      dataIndex: 'limit',
      render: (text: any, record: any) => (
        <span>
          {record.rowNum} x {record.colNum}
        </span>
      ),
    },
    {
      title: '托底',
      dataIndex: 'rebaseType',
      render: (text: any, record: any) => (
        <span>{text === 1 ? '保持原状' : text === 2 ? '不托底' : record.rebaseName}</span>
      ),
    },
    {
      title: '添加时间',
      dataIndex: 'createTime',
      render: (text: any) => <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text: any, record: any) => {
        const editable = this.isEditing(record)
        return (
          <React.Fragment>
            {editable ? (
              <span>
                <EditableContext.Consumer>
                  {(form: WrappedFormUtils) => (
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
              <a onClick={() => this.handleEdit(record.id)}>编辑</a>
            )}
            <Divider type="vertical" />
            <a onClick={() => this.handleShowDetail(record)}>详情</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleFormatSet(true, record)}>状态</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleShowTemplate(record)}>模板</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleShowPreview(record)}>预览</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleBuildCode(record)}>生成代码</a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除?" onConfirm={() => this.handleRemove(record.id)}>
              <a>删除</a>
            </Popconfirm>
          </React.Fragment>
        )
      },
    },
  ]

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'place/fetch',
    })
    dispatch({
      type: 'media/fetch',
      payload: {
        currentPage: 1,
        pageSize: 999,
      },
      callback: res => {
        this.setState({
          mediaList: res.data.list,
        })
      },
    })
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
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
      type: 'place/fetch',
      payload: params,
    })
  }

  handleMediaChange = value => {
    const { dispatch } = this.props
    dispatch({
      type: 'channel/fetch',
      payload: {
        mediaId: value,
        currentPage: 1,
        pageSize: 999,
      },
      callback: res => {
        this.setState({
          channelList: res.data.list,
        })
      },
    })
  }

  handleFormReset = () => {
    const { form, dispatch } = this.props
    form.resetFields()
    this.setState({
      formValues: {},
    })
    dispatch({
      type: 'place/fetch',
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

      const values = {
        ...fieldsValue,
        [fieldsValue.contentType]: fieldsValue.content,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      }

      delete values.contentType
      delete values.content

      this.setState({
        formValues: values,
      })

      dispatch({
        type: 'place/fetch',
        payload: values,
      })
    })
  }

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    })
  }

  handleModalFormatVisible = (flag?: boolean) => {
    this.setState({
      modalFormatVisible: !!flag,
    })
  }

  handleModalTemplateVisible = (flag?: boolean) => {
    this.setState({
      modalTemplateVisible: !!flag,
    })
  }

  handleModalBuildCodeVisible = (flag?: boolean) => {
    this.setState({
      modalBuildCodeVisible: !!flag,
    })
  }

  handleShowTemplate = (record: any) => {
    const { dispatch } = this.props
    dispatch({
      type: 'place/fetchTemplateById',
      payload: {
        id: record.id,
      },
      callback: res => {
        this.setState({ template: res.data })
      },
    })
    this.setState({
      current: record,
    })
    this.handleModalTemplateVisible(true)
  }

  handleModalPreviewVisible = (flag?: boolean) => {
    this.setState({
      modalPreviewVisible: !!flag,
    })
  }

  handleShowPreview = (record: any) => {
    const { dispatch } = this.props
    dispatch({
      type: 'place/fetchPreviewById',
      payload: {
        id: record.id,
      },
      callback: res => {
        this.setState({ previews: res.data })
      },
    })
    this.handleModalPreviewVisible(true)
  }

  handleBuildCode = (record: any) => {
    this.setState({
      current: record,
    })
    this.handleModalBuildCodeVisible(true)
  }

  handleFormatSet = (flag: boolean, record: any) => {
    const { dispatch } = this.props
    dispatch({
      type: 'place/fetchSequenceById',
      payload: {
        id: record.id,
      },
      callback: res => {
        if (record.placeTypeCode === 'GRID') {
          this.cellGridState.rowNum = record.rowNum
        }
        if (record.placeTypeCode === 'CAROUSEL') {
          this.cellColState.colNum = record.colNum
        }
        this.setState({
          currentId: record.id,
          currentType: record.type,
          currentTypeCode: record.placeTypeCode,
          currentCells: res.data,
          modalFormatVisible: !!flag,
        })
      },
    })
  }

  handleAdd = (fields: any) => {
    const { dispatch } = this.props
    const { formData } = this.state
    dispatch({
      type: 'place/add',
      payload: {
        ...fields,
        type: formData.type,
      },
      callback: () => {
        dispatch({
          type: 'place/fetch',
        })
      },
    })

    message.success('添加成功')
    this.handleModalVisible()
  }

  handleFormatAdd = () => {
    this.handleModalFormatVisible()
    const {
      dispatch,
      place: {
        data: { pagination },
      },
    } = this.props
    const { currentId, currentTypeCode } = this.state
    if (currentTypeCode === 'GRID' || currentTypeCode === 'CAROUSEL') {
      dispatch({
        type: currentTypeCode === 'GRID' ? 'place/updatePlacesGridCell' : 'place/update',
        payload: {
          id: currentId,
          params:
            currentTypeCode === 'GRID'
              ? {
                  ...this.cellGridState,
                }
              : {
                  colNum: this.cellColState.colNum,
                },
        },
        callback: () => {
          this.cellGridState.deleteRow = ''
          dispatch({
            type: 'place/fetch',
            payload: {
              currentPage: pagination.current,
              pageSize: pagination.pageSize,
            },
          })
        },
      })
    }
  }

  handleRowRemove = (row: number) => {
    const { currentCells } = this.state
    const is = currentCells[row].filter(x => x).filter(y => y.status)
    if (is.length > 0) {
      message.error('该行有正在运行的广告,无法删除!')
      return
    }
    const currentRow = Math.ceil(currentCells[row][0].sequence / currentCells[row].length)

    const result = currentCells.slice(0, row).concat(currentCells.slice(row + 1))

    if (currentRow) {
      this.cellGridState = {
        ...this.cellGridState,
        deleteRow: this.cellGridState.deleteRow
          ? `${this.cellGridState.deleteRow},${currentRow.toString()}`
          : currentRow.toString(),
      }
    } else {
      this.cellGridState = {
        ...this.cellGridState,
        rowNum: this.cellGridState.rowNum - 1,
      }
    }

    this.setState({
      currentCells: result,
    })
  }

  handleRowAdd = () => {
    const { currentCells } = this.state
    const cols = currentCells[0].length
    const temp = []
    for (let i = 0; i < cols; i += 1) {
      temp.push({ disabled: true, status: 0, text: '新增', value: false })
    }
    this.cellGridState = {
      ...this.cellGridState,
      rowNum: this.cellGridState.rowNum + 1,
    }
    this.setState({
      currentCells: currentCells.concat([temp]),
    })
  }

  handleColRemove = (col: number) => {
    const { currentCells } = this.state
    if (currentCells[0][col].status) {
      message.error('该列有正在运行的广告,无法删除!')
      return
    }
    this.cellColState.colNum = currentCells[0].length - 1
    const result = currentCells[0].slice(0, col).concat(currentCells[0].slice(col + 1))
    this.setState({
      currentCells: [result],
    })
  }

  handleColAdd = () => {
    const { currentCells } = this.state
    this.cellColState.colNum = currentCells[0].length + 1
    this.setState({
      currentCells: [
        currentCells[0].concat([{ disabled: true, status: 0, text: '新增', value: false }]),
      ],
    })
  }

  handleTypeChange = (form: WrappedFormUtils, value: any) => {
    this.setState({
      formData: {
        type: value.placeTypeId,
        code: value.placeTypeCode,
      },
    })
    if (value === 0) {
      form.setFieldsValue({
        row: 1,
        col: 1,
      })
    }
    if (value === 1) {
      form.setFieldsValue({
        row: 1,
        col: '',
      })
    }
    if (value === 2) {
      form.setFieldsValue({
        row: '',
        col: '',
      })
    }
  }

  handleTemplateUpdate = (content: string) => {
    const { dispatch } = this.props
    const { current } = this.state
    dispatch({
      type: 'place/updateTemplates',
      payload: { id: current.id, template: content },
      callback: () => {
        message.success('修改成功', 1)
        this.handleModalTemplateVisible()
      },
    })
  }

  handleCancel = () => {
    this.setState({ editingKey: '' })
  }

  isEditing = (record: any) => {
    const { editingKey } = this.state
    return record.id === editingKey
  }

  handleSave(form: WrappedFormUtils, id: number) {
    const { dispatch } = this.props
    form.validateFields((error, row) => {
      if (error) {
        return
      }
      dispatch({
        type: 'place/updateByName',
        payload: { id, params: row },
      })
      this.setState({ editingKey: '' })
    })
  }

  handleEdit(key: string) {
    this.setState({ editingKey: key })
  }

  handleCreate() {
    this.setState({
      currentAction: 'create',
      current: {},
    })
    this.handleModalVisible(true)
  }

  handleShowDetail(record: any) {
    this.setState({
      currentAction: 'show',
      current: record,
    })
    this.handleModalVisible(true)
  }

  handleRemove(id: number) {
    const {
      dispatch,
      place: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'place/remove',
      payload: {
        id,
      },
      callback: () => {
        dispatch({
          type: 'place/fetch',
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
    const { mediaList, channelList } = this.state
    const prefixSelector = getFieldDecorator('contentType', {
      initialValue: 'code',
    })(
      <Select style={{ width: 115 }}>
        <Option value="code">广告位编号</Option>
        <Option value="name">广告位名称</Option>
      </Select>
    )
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24}>
            <FormItem label="媒体">
              {getFieldDecorator('mediaId')(
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  placeholder="请选择媒体"
                  onChange={this.handleMediaChange}
                  style={{ width: '100%' }}
                  allowClear
                >
                  {mediaList.map((x: any) => (
                    <Option key={x.id} value={x.id}>
                      {x.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="频道">
              {getFieldDecorator('adChannelId')(
                <Select placeholder="请选择频道" style={{ width: '100%' }} allowClear>
                  {channelList.map((x: any) => (
                    <Option key={x.id} value={x.id}>
                      {x.name}
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem>
              {getFieldDecorator('content')(
                <Input addonBefore={prefixSelector} style={{ width: '100%' }} allowClear />
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
      place: { data },
      loading,
    } = this.props
    const {
      selectedRows,
      modalVisible,
      formData,
      modalFormatVisible,
      modalTemplateVisible,
      modalBuildCodeVisible,
      modalPreviewVisible,
      currentCells,
      currentType,
      currentTypeCode,
      currentAction,
      current,
      mediaList,
      channelList,
      template,
      previews,
    } = this.state
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleTypeChange: this.handleTypeChange,
    }

    const parentFormatModalMethods = {
      handleFormatAdd: this.handleFormatAdd,
      handleRowRemove: this.handleRowRemove,
      handleRowAdd: this.handleRowAdd,
      handleColRemove: this.handleColRemove,
      handleColAdd: this.handleColAdd,
      handleModalFormatVisible: this.handleModalFormatVisible,
    }

    const parentTemplateModalMethods = {
      handleTemplateUpdate: this.handleTemplateUpdate,
      handleModalTemplateVisible: this.handleModalTemplateVisible,
    }

    const parentBuildCodeModalMethods = {
      handleModalBuildCodeVisible: this.handleModalBuildCodeVisible,
    }

    const parentPreviewModalMethods = {
      handleModalPreviewVisible: this.handleModalPreviewVisible,
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
      <PageHeaderWrapper title="广告位列表">
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
        <CreateForm
          {...parentMethods}
          modalVisible={modalVisible}
          formData={formData}
          currentAction={currentAction}
          current={current}
          mediaList={mediaList}
          channelList={channelList}
        />
        <FormatModal
          {...parentFormatModalMethods}
          modalFormatVisible={modalFormatVisible}
          currentCells={currentCells}
          currentType={currentType}
          currentTypeCode={currentTypeCode}
        />
        <CreateTemplate
          {...parentTemplateModalMethods}
          modalTemplateVisible={modalTemplateVisible}
          templates={template}
        />
        <PreviewPlace
          {...parentPreviewModalMethods}
          modalPreviewVisible={modalPreviewVisible}
          previews={previews}
        />
        <BuildCode
          {...parentBuildCodeModalMethods}
          modalBuildCodeVisible={modalBuildCodeVisible}
          key={current.id}
          placeId={current.placeId}
        />
      </PageHeaderWrapper>
    )
  }
}

const mapStateToProps = (state: any) => ({
  place: state.place,
  loading: state.loading.models.place,
})

export default connect(mapStateToProps)(Form.create()(PlaceList))
