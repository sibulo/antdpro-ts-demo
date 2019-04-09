import * as React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Button,
  Divider,
  Popconfirm,
  DatePicker,
  Cascader,
  message,
} from 'antd'
import Zmage from 'react-zmage'
import { FormComponentProps } from 'antd/lib/form/Form'
import StandardTable from '@/components/StandardTable'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'

import styles from './List.less'
import Uploader from '@/pages/Advert/Uploader.tsx'
import PreviewAdvert from '@/pages/Advert/PreviewAdvert'

const FormItem = Form.Item
const { Option } = Select
const { RangePicker } = DatePicker
const InputGroup = Input.Group

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

interface IFormComponentProps extends FormComponentProps {
  dispatch: any
  advert: any
  loading: any
}

interface IState {
  readonly selectedRows: []
  readonly formValues: any
  readonly modalUploaderVisible: boolean
  readonly currentFile: any
  readonly options: []
  readonly modalPreviewVisible: boolean
  readonly previews: string
}

class AdvertList extends React.PureComponent<IFormComponentProps, IState> {
  readonly state: IState = {
    selectedRows: [],
    formValues: {},
    modalUploaderVisible: false,
    currentFile: null,
    options: [],
    modalPreviewVisible: false,
    previews: '',
  }

  columns = [
    {
      title: '广告编号',
      dataIndex: 'code',
    },
    {
      title: '公司名称',
      dataIndex: 'companyName',
    },
    {
      title: '广告位',
      dataIndex: 'placeName',
    },
    {
      title: '广告图片',
      dataIndex: 'src',
      render: (text, record) => (
        <Zmage
          src={`${record.material!.url}?x-oss-process=image/resize,m_lfit,h_100,w_200`}
          alt={record.name}
          set={[
            {
              src: record.material!.url,
              alt: record.material!.name,
            },
          ]}
        />
      ),
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '添加时间',
      dataIndex: 'updateTime',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '当前状态',
      dataIndex: 'statusName',
    },
    {
      title: '添加人',
      dataIndex: 'creatorName',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (text, record) => (
        <React.Fragment>
          {record.status === 1 ||
          record.status === 2 ||
          record.status === 3 ||
          record.status === 4 ? (
            <React.Fragment>
              <a onClick={() => this.handleShowModal(record)}>广告图片</a>
              <Divider type="vertical" />
              <a onClick={() => this.navigatorTo(`/advert/edit/${record.id}`)}>编辑</a>
            </React.Fragment>
          ) : (
            <a onClick={() => this.navigatorTo(`/advert/edit/${record.id}?type=again`)}>再预定</a>
          )}
          {record.status === 2 && (
            <React.Fragment>
              <Divider type="vertical" />
              <Popconfirm title="确认投放?" onConfirm={() => this.handleAuditPass(record.id)}>
                <a>确认投放</a>
              </Popconfirm>
            </React.Fragment>
          )}
          {record.status !== 4 && (
            <React.Fragment>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRemove(record.id)}>
                <a>删除</a>
              </Popconfirm>
            </React.Fragment>
          )}
          {record.status === 4 && (
            <React.Fragment>
              <Divider type="vertical" />
              <Popconfirm title="确定终止?" onConfirm={() => this.handleStop(record.id)}>
                <a>终止</a>
              </Popconfirm>
            </React.Fragment>
          )}
          {record.status !== 1 && (
            <React.Fragment>
              <Divider type="vertical" />
              <a onClick={() => this.handleShowPreview(record)}>预览</a>
            </React.Fragment>
          )}
          {record.status > 1 && (
            <React.Fragment>
              <Divider type="vertical" />
              <a onClick={() => this.handleSetRebase(record)}>设为托底</a>
            </React.Fragment>
          )}
          {/* <Divider type="vertical" />
          <a onClick={() => this.navigatorTo(`/advert/stats/${record.id}`)}>查看统计</a> */}
        </React.Fragment>
      ),
    },
  ]

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'advert/fetch',
    })
    dispatch({
      type: 'media/fetch',
      payload: {
        currentPage: 1,
        pageSize: 999,
      },
      callback: res => {
        this.setState({
          options: res.data.list.map(x => ({
            value: x.id,
            label: x.name,
            isLeaf: false,
          })),
        })
      },
    })
  }

  loadData = selectedOptions => {
    const { dispatch } = this.props
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    if (selectedOptions.length === 1) {
      dispatch({
        type: 'channel/fetch',
        payload: {
          mediaId: targetOption.value,
        },
        callback: res => {
          targetOption.loading = false
          targetOption.children = res.data.list.map(x => ({
            value: x.id,
            label: x.name,
            isLeaf: false,
          }))
          this.setState({
            options: [...this.state.options] as [],
          })
        },
      })
    } else {
      dispatch({
        type: 'place/fetch',
        payload: {
          channelId: targetOption.value,
        },
        callback: res => {
          targetOption.loading = false
          targetOption.children = res.data.list.map(x => ({
            value: x.id,
            label: x.name,
            isLeaf: true,
          }))
          this.setState({
            options: [...this.state.options] as [],
          })
        },
      })
    }
  }

  handlePlaceChange = () => {}

  navigatorTo = path => {
    const { dispatch } = this.props
    dispatch(routerRedux.push(path))
  }

  handleModalUploaderVisible = (flag?: boolean) => {
    const { dispatch, form } = this.props
    const { currentFile } = this.state
    const materialId = form.getFieldValue('materialId')
    const materialUrl = form.getFieldValue('materialUrl')
    if (materialId && materialUrl) {
      dispatch({
        type: 'advert/edit',
        payload: {
          id: currentFile.id,
          materialId,
          materialUrl,
        },
        callback: () => {
          message.success('修改图片成功！')
          form.setFieldsValue({
            materialId: '',
            materialUrl: '',
          })
          dispatch({
            type: 'advert/fetch',
          })
        },
      })
    }
    this.setState({
      modalUploaderVisible: !!flag,
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
      type: 'advert/fetch',
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
      type: 'advert/fetch',
      payload: {},
    })
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    })
  }

  handleSearch = e => {
    const { dispatch, form } = this.props

    form.validateFields((err, fieldsValue) => {
      if (err) return

      let [mediaId, channelId, placeId] = [undefined, undefined, undefined]

      if (fieldsValue.place) {
        ;[mediaId, channelId, placeId] = fieldsValue.place
      }

      const values = {
        ...fieldsValue,
        mediaId,
        channelId,
        placeId,
        [fieldsValue.contentType]: fieldsValue.content,
        [fieldsValue.dateType]: fieldsValue.date
          ? `${fieldsValue.date[0].format('YYYY-MM-DD')},${fieldsValue.date[1].format(
              'YYYY-MM-DD'
            )}`
          : undefined,
      }

      delete values.place
      delete values.selected
      delete values.url
      delete values.file
      delete values.content
      delete values.contentType
      delete values.dateType
      delete values.date

      this.setState({
        formValues: values,
      })

      dispatch({
        type: 'advert/fetch',
        payload: values,
      })
    })
  }

  handleRemove(id) {
    const {
      dispatch,
      advert: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'advert/remove',
      payload: {
        id,
      },
      callback: () => {
        dispatch({
          type: 'advert/fetch',
          payload: {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
          },
        })
      },
    })
  }

  handleShowModal(record) {
    this.handleModalUploaderVisible(true)
    this.setState({
      currentFile: {
        id: record.id,
        companyName: record.companyName,
        advId: record.advId,
        width: record.material.width,
        height: record.material.height,
      },
    })
  }

  handleSetRebase(record) {
    const { dispatch } = this.props
    dispatch(routerRedux.push('/rebase/list', record))
  }

  handleAuditPass(id) {
    const {
      dispatch,
      advert: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'advert/updateAdvertAudit',
      payload: {
        id,
      },
      callback: () => {
        message.success('已确认投放！')
        dispatch({
          type: 'advert/fetch',
          payload: {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
          },
        })
      },
    })
  }

  handleStop(id) {
    const {
      dispatch,
      advert: {
        data: { pagination },
      },
    } = this.props
    dispatch({
      type: 'advert/updateAdvertStop',
      payload: {
        id,
      },
      callback: () => {
        message.success('终止成功！')
        dispatch({
          type: 'advert/fetch',
          payload: {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
          },
        })
      },
    })
  }

  handleModalPreviewVisible = (flag?: boolean) => {
    this.setState({
      modalPreviewVisible: !!flag,
    })
  }

  handleShowPreview = (record: any) => {
    const { dispatch } = this.props
    dispatch({
      type: 'advert/fetchPreviewById',
      payload: {
        id: record.id,
        placeId: record.placeId,
      },
      callback: res => {
        this.setState({ previews: res.data })
      },
    })
    this.handleModalPreviewVisible(true)
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props
    const { options } = this.state
    const prefixSelector = getFieldDecorator('contentType', {
      initialValue: 'code',
    })(
      <Select style={{ width: 100 }}>
        <Option value="code">广告编号</Option>
        <Option value="companyName">公司名称</Option>
        <Option value="creatorName">添加人</Option>
        <Option value="remark">备注</Option>
      </Select>
    )
    return (
      <Form layout="inline">
        {getFieldDecorator('materialId', {
          initialValue: '',
        })(<Input type="hidden" />)}
        {getFieldDecorator('materialUrl', {
          initialValue: '',
        })(<Input type="hidden" />)}
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={15} sm={24}>
            <FormItem label="广告位">
              {getFieldDecorator('place')(
                <Cascader
                  options={options}
                  loadData={this.loadData}
                  onChange={this.handlePlaceChange}
                  style={{ width: '100%' }}
                  placeholder="请选择广告位"
                  allowClear
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem>
              {getFieldDecorator('content')(
                <Input
                  addonBefore={prefixSelector}
                  placeholder="请输入关键字"
                  style={{ width: '100%' }}
                  allowClear
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={7} sm={24} className={styles['override-ant-form-item']}>
            <InputGroup style={{ display: 'flex' }} compact>
              <FormItem>
                {getFieldDecorator('dateType', {
                  initialValue: 'createTimeRange',
                })(
                  <Select
                    className={styles['override-ant-select-selection']}
                    style={{ width: 100 }}
                  >
                    <Option value="createTimeRange">添加时间</Option>
                    <Option value="startTimeRange">开始时间</Option>
                    <Option value="endTimeRange">结束时间</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('date', {})(
                  <RangePicker
                    allowClear
                    style={{ flexGrow: 1 }}
                    placeholder={['开始时间', '结束时间']}
                  />
                )}
              </FormItem>
            </InputGroup>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="广告状态">
              {getFieldDecorator('status')(
                <Select placeholder="请选择广告状态" style={{ width: '100%' }} allowClear>
                  <Option value="1">已预定</Option>
                  <Option value="2">待确认</Option>
                  <Option value="3">即将投放</Option>
                  <Option value="4">投放中</Option>
                  <Option value="5">已终止</Option>
                  <Option value="6">已结束</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="广告类型">
              {getFieldDecorator('type')(
                <Select placeholder="请选择广告类型" style={{ width: '100%' }} allowClear>
                  <Option value="1">付费广告</Option>
                  <Option value="2">运营广告</Option>
                  <Option value="3">赠送广告</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" onClick={this.handleSearch}>
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
      form,
      advert: { data },
      loading,
    } = this.props
    const {
      selectedRows,
      modalUploaderVisible,
      currentFile,
      modalPreviewVisible,
      previews,
    } = this.state
    const parentPreviewModalMethods = {
      handleModalPreviewVisible: this.handleModalPreviewVisible,
    }
    return (
      <PageHeaderWrapper title="广告列表">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.navigatorTo('/advert/create')}>
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
        <PreviewAdvert
          {...parentPreviewModalMethods}
          modalPreviewVisible={modalPreviewVisible}
          previews={previews}
        />
        <Uploader
          currentFile={currentFile}
          form={form}
          modalUploaderVisible={modalUploaderVisible}
          handleModalUploaderVisible={this.handleModalUploaderVisible}
        />
      </PageHeaderWrapper>
    )
  }
}

const mapStateToProps = state => ({
  advert: state.advert,
  loading: state.loading.models.advert,
})

export default connect(mapStateToProps)(Form.create()(AdvertList))
