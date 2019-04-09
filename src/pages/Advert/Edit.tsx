import * as React from 'react'
import { connect } from 'dva'
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  Cascader,
  Spin,
  Row,
  Col,
  Divider,
  message,
  Icon,
} from 'antd'
import { routerRedux } from 'dva/router'
import debounce from 'lodash/debounce'
import throttle from 'lodash/throttle'
import moment from 'moment'
import _ from 'lodash'
import { FormComponentProps } from 'antd/lib/form/Form'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import PlaceDragTable from '@/components/PlaceDragTable'
import Uploader from '@/pages/Advert/Uploader.tsx'
import { queryCustomers, queryContracts, queryMediaAll } from '@/services/common.ts'
import { queryAdvertSequences } from '@/services/advert'
import { queryById } from '@/services/place'

const FormItem = Form.Item
const { Option } = Select
const { TextArea } = Input

const uploadButtonStyle: React.CSSProperties = {
  position: 'absolute',
  left: 122,
  bottom: 20,
}

interface IFormComponentProps extends FormComponentProps {
  location: any
  match: any
  dispatch: any
  advert: any
  submitting: any
}

interface IState {
  readonly companyData: []
  readonly fetching: any
  readonly modalUploaderVisible: boolean
  readonly options: []
  readonly cells: any
  readonly contracts: any
  readonly placeTypeCode: string
}

class AdvertEdit extends React.PureComponent<IFormComponentProps, IState> {
  constructor(props) {
    super(props)
    this.fetchCompany = debounce(this.fetchCompany, 800)
    this.handleSubmit = debounce(this.handleSubmit, 800)
  }

  currentFile = {
    companyName: '',
    advId: '',
    height: '',
    width: '',
  }

  lastFetchId = 0

  readonly state: IState = {
    companyData: [],
    fetching: false,
    modalUploaderVisible: false,
    options: [],
    cells: [],
    contracts: [],
    placeTypeCode: '',
  }

  componentDidMount() {
    const { dispatch, match } = this.props
    if (match.params.id) {
      dispatch({
        type: 'advert/fetchById',
        payload: {
          id: match.params.id,
        },
        callback: res => {
          setTimeout(() => {
            queryContracts({ id: res.data.advId }).then(res => {
              this.setState({
                contracts: res.data,
              })
            })
            if (res.data.placeId) {
              queryAdvertSequences({
                startTime: moment(res.data.startTime).format('YYYY-MM-DD'),
                endTime: moment(res.data.endTime).format('YYYY-MM-DD'),
                placeId: res.data.placeId,
                adId: match.params.id,
              }).then(res => {
                this.setState({ cells: res.data })
                this.currentFile = {
                  ...this.currentFile,
                  width: res.data ? res.data.width : 0,
                  height: res.data ? res.data.height : 0,
                }
              })
            }
            queryById({
              id: res.data.placeId,
            }).then(res => {
              this.setState({ placeTypeCode: res.data.placeTypeCode })
            })
          }, 0)
        },
      })
    }

    queryMediaAll().then(res => {
      this.setState({
        options: res.data,
      })
    })
  }

  fetchCompany = (value: string) => {
    this.lastFetchId += 1
    const fetchId = this.lastFetchId
    this.setState({ companyData: [], fetching: true })
    queryCustomers({ name: value, limit: 10 }).then(res => {
      if (fetchId !== this.lastFetchId) {
        // for fetch callback order
        return
      }
      const companyData = res.data.list.map((item: any) => ({
        text: item.name,
        value: item.id,
      }))
      this.setState({ companyData, fetching: false })
    })
  }

  handleCompanyChange = value => {
    this.currentFile = {
      ...this.currentFile,
      companyName: value.label,
      advId: value.key,
    }
    this.setState({
      companyData: [],
      fetching: false,
    })
    queryContracts({ id: value.key }).then(res => {
      this.setState({
        contracts: res.data,
      })
    })
  }

  handleTableChange = value => {
    this.setState({
      cells: value,
    })
  }

  handleModalUploaderVisible = (flag?: boolean) => {
    this.setState({
      modalUploaderVisible: !!flag,
    })
  }

  handleSubmit = e => {
    const { dispatch, form, location } = this.props
    const { cells } = this.state
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const startTime = moment(values.startTime).format('YYYY-MM-DD hh:mm:ss')
        const endTime = moment(values.endTime).format('YYYY-MM-DD hh:mm:ss')
        const [mediaId, channelId, placeId] = values.place
        const advId = values.company.key
        const companyName = values.company.label
        const result = _.orderBy(
          _.filter(_.flattenDeep(cells), x => x.value),
          ['sequence'],
          ['asc']
        ).map(z => z.sequence)
        if (result.length === 0) {
          message.error('请选择至少一个广告位置！')
          return
        }
        const seq = result[0] ? result[0].toString() : ''
        const placeIdxs = result[0] ? result.toString() : ''
        const contractCode = values.contractCode.toString()
        delete values.place
        delete values.company
        delete values.startTime
        delete values.endTime
        delete values.contractCode
        const { type } = location.query
        if (type === 'again') {
          delete values.id
          dispatch({
            type: 'advert/add',
            payload: {
              ...values,
              startTime,
              endTime,
              mediaId,
              channelId,
              placeId,
              advId,
              companyName,
              seq,
              placeIdxs,
              contractCode,
            },
            callback: () => {
              message.success('新增成功')
              this.handleRefreshPlace(form, placeId)
            },
          })
        } else {
          dispatch({
            type: 'advert/edit',
            payload: {
              ...values,
              strStartTime: startTime,
              strEndTime: endTime,
              mediaId,
              channelId,
              placeId,
              advId,
              companyName,
              seq,
              placeIdxs,
              contractCode,
            },
            callback: () => {
              message.success('编辑成功！')
              this.handleRefreshPlace(form, placeId)
            },
          })
        }
      }
    })
  }

  navigatorTo = path => {
    const { dispatch } = this.props
    dispatch(routerRedux.push(path))
  }

  Upload = (): any => {
    this.handleModalUploaderVisible(true)
  }

  handlePlaceChange = value => {
    const { form } = this.props
    if (!(form.getFieldValue('startTime') && form.getFieldValue('endTime'))) {
      setTimeout(() => {
        form.setFieldsValue({
          place: [],
        })
      }, 0)
      message.error('请先选择开始日期和结束日期')
      return
    }
    const placeId = value[2]
    if (placeId) {
      this.handleRefreshPlace(form, placeId)
    } else {
      message.error('请先选择广告位！')
    }
  }

  disabledStartDate = current => {
    return (
      current <
      moment()
        .endOf('day')
        .subtract(1, 'days')
    )
  }

  disabledEndDate = current => {
    const { form } = this.props
    return (
      current <
      (form.getFieldValue('startTime') ? moment(form.getFieldValue('startTime')) : moment()).endOf(
        'day'
      )
    )
  }

  handleStartTimeChange = () => {
    const { form } = this.props
    form.setFieldsValue({
      endTime: null,
    })
  }

  handleEndTimeChange = () => {
    const { form } = this.props
    if (!form.getFieldValue('startTime')) {
      setTimeout(() => {
        form.setFieldsValue({
          endTime: null,
        })
      }, 0)
      message.error('请先选择开始时间!')
    }
  }

  handleImageRemove = e => {
    e.preventDefault()
    e.stopPropagation()
    const { form } = this.props
    form.setFieldsValue({
      materialId: '',
      materialUrl: '',
    })
  }

  private handleRefreshPlace(form, placeId: any) {
    queryAdvertSequences({
      startTime: moment(form.getFieldValue('startTime')).format('YYYY-MM-DD'),
      endTime: moment(form.getFieldValue('endTime')).format('YYYY-MM-DD'),
      placeId,
    }).then(res => {
      this.setState({ cells: res.data })
      this.currentFile = {
        ...this.currentFile,
        width: res.data.width,
        height: res.data.height,
      }
    })
    queryById({
      id: placeId,
    }).then(res => {
      this.setState({ placeTypeCode: res.data.placeTypeCode })
    })
  }

  render() {
    const {
      form,
      advert: { data },
      submitting,
    } = this.props

    const { current } = data

    const { options, placeTypeCode } = this.state

    const { getFieldDecorator } = form

    const { fetching, companyData, modalUploaderVisible, cells, contracts } = this.state

    const imagePlaceholdClass: React.CSSProperties = {
      width: 300,
      height: 150,
      position: 'relative',
      background: form.getFieldValue('materialUrl')
        ? `url(${form.getFieldValue('materialUrl')}) no-repeat scroll center center / 50%`
        : '#CCFFFF',
      cursor: 'pointer',
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 12 },
      },
    }

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    }

    const parentMethods = {
      handleModalUploaderVisible: this.handleModalUploaderVisible,
    }

    const contractRender = (menuNode, props) => (
      <div>
        <Row type="flex" justify="space-around">
          <Col span={10}>
            <div>合同编号</div>
          </Col>
          <Col span={3}>
            <div>合同状态</div>
          </Col>
          <Col span={11}>
            <div>合同时间</div>
          </Col>
        </Row>
        <Divider style={{ margin: '4px 0' }} />
        {menuNode}
      </div>
    )

    return (
      <PageHeaderWrapper title="广告编辑">
        <Card bordered={false}>
          <Form style={{ marginTop: 8 }}>
            {getFieldDecorator('id', {
              initialValue: current.id,
            })(<Input type="hidden" />)}
            {getFieldDecorator('materialId', {
              initialValue: current.materialId,
            })(<Input type="hidden" />)}
            {getFieldDecorator('materialUrl', {
              initialValue: current.materialUrl,
            })(<Input type="hidden" />)}
            <FormItem {...formItemLayout} label="公司名称">
              {getFieldDecorator('company', {
                initialValue: current.advId
                  ? { key: current.advId, label: current.companyName }
                  : [],
                rules: [
                  {
                    required: true,
                    message: '请输入公司名称',
                  },
                ],
              })(
                <Select
                  disabled={current.status === 3 || current.status === 4}
                  showSearch
                  labelInValue
                  placeholder="请输入公司名称"
                  notFoundContent={fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchCompany}
                  onChange={this.handleCompanyChange}
                  style={{ width: '100%' }}
                >
                  {companyData.map((d: { value: string; text: string }) => (
                    <Option key={d.value}>{d.text}</Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="开始日期">
              {getFieldDecorator('startTime', {
                initialValue: moment(current.startTime, 'YYYY-MM-DD') || null,
                rules: [
                  {
                    required: true,
                    message: '请选择开始日期',
                  },
                ],
              })(
                <DatePicker
                  disabled={current.status === 3 || current.status === 4}
                  allowClear={false}
                  format="YYYY-MM-DD 00:00:00"
                  disabledDate={this.disabledStartDate}
                  style={{ width: '100%' }}
                  onChange={this.handleStartTimeChange}
                  placeholder="请选择开始日期"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="结束日期">
              {getFieldDecorator('endTime', {
                initialValue: moment(current.endTime, 'YYYY-MM-DD') || null,
                rules: [
                  {
                    required: true,
                    message: '请选择结束日期',
                  },
                ],
              })(
                <DatePicker
                  disabled={current.status === 3 || current.status === 4}
                  allowClear={false}
                  format="YYYY-MM-DD 00:00:00"
                  disabledDate={this.disabledEndDate}
                  style={{ width: '100%' }}
                  onChange={this.handleEndTimeChange}
                  placeholder="请选择结束日期"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="选择广告位">
              {getFieldDecorator('place', {
                initialValue: [current.mediaId, current.channelId, current.placeId] || [],
                rules: [
                  {
                    required: true,
                    message: '请选择广告位',
                  },
                ],
              })(
                <Cascader
                  disabled={current.status === 3 || current.status === 4}
                  options={options}
                  fieldNames={{ label: 'name', value: 'id', children: 'childrens' }}
                  onChange={this.handlePlaceChange}
                  style={{ width: '100%' }}
                  placeholder="请选择广告位"
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} required label="广告位置">
              {cells && (
                <PlaceDragTable
                  drag={placeTypeCode === 'GRID'}
                  onChange={this.handleTableChange}
                  value={cells}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="广告名称">
              {form.getFieldDecorator('name', {
                initialValue: current.name || '',
                rules: [{ required: true, whitespace: true, message: '请输入广告名称！' }],
              })(<Input placeholder="请输入广告名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="广告类型">
              {getFieldDecorator('type', {
                initialValue: current.type || [],
                rules: [
                  {
                    required: true,
                    message: '请选择广告类型',
                  },
                ],
              })(
                <Select placeholder="请选择广告类型" style={{ width: '100%' }}>
                  <Option value={1}>付费广告</Option>
                  <Option value={2}>运营广告</Option>
                  <Option value={3}>赠送广告</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="合同">
              {getFieldDecorator('contractCode', {
                initialValue: current.contractCode ? current.contractCode.toString() : [],
                rules: [
                  {
                    required: false,
                    message: '请选择合同',
                  },
                ],
              })(
                <Select
                  style={{ width: '100%' }}
                  placeholder="请选择合同"
                  dropdownRender={contractRender}
                  dropdownStyle={{
                    textAlign: 'center',
                  }}
                >
                  {contracts.map((x: any) => (
                    <Option key={x.id} value={x.id.toString()}>
                      <Row type="flex" justify="space-around">
                        <span>{x.code}</span>&nbsp;&nbsp;
                        <span>{x.statusStr}</span>&nbsp;&nbsp;
                        <span>
                          {`${moment(x.startTime).format('YYYY-MM-DD')}~${moment(x.endTime).format(
                            'YYYY-MM-DD'
                          )}`}
                        </span>
                      </Row>
                    </Option>
                  ))}
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="链接类型">
              {getFieldDecorator('linkType', {
                initialValue: current.linkType || [],
              })(
                <Select placeholder="请选择链接类型" style={{ width: '100%' }}>
                  <Option value={1}>内部链接</Option>
                  <Option value={2}>外部链接</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="链接地址">
              {getFieldDecorator('linkUrl', {
                initialValue: current.linkUrl || '',
                rules: [
                  {
                    required: false,
                    message: '请输入链接地址',
                  },
                ],
              })(<Input placeholder="请输入链接地址" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="广告图片">
              <div style={imagePlaceholdClass} onClick={this.Upload}>
                <div style={uploadButtonStyle}>选择图片</div>
                {/* <Icon
                  style={{
                    fontSize: '18px',
                    position: 'absolute',
                    top: 10,
                    right: 10,
                  }}
                  type="close"
                  onClick={this.handleImageRemove}
                /> */}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark', {
                initialValue: current.remark || '',
                rules: [
                  {
                    required: false,
                    message: '请输入备注',
                  },
                ],
              })(<TextArea style={{ minHeight: 32 }} placeholder="请输入备注" rows={4} />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" onClick={this.handleSubmit} loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
        <Uploader
          {...parentMethods}
          form={form}
          currentFile={this.currentFile}
          modalUploaderVisible={modalUploaderVisible}
        />
      </PageHeaderWrapper>
    )
  }
}

const mapStateToProps = state => ({
  advert: state.advert,
  submitting: state.loading.effects['advert/edit'],
})

export default connect(mapStateToProps)(Form.create()(AdvertEdit))
