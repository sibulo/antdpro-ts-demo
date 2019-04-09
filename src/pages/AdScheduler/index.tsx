import React from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import { Row, Col, Card, Form, Button, DatePicker, Cascader, Spin, Empty } from 'antd'
import { SchedulerData, ViewTypes, DATE_FORMAT } from 'react-big-scheduler'
import { stringify } from 'qs'
import debounce from 'lodash/debounce'
import { FormComponentProps } from 'antd/lib/form/Form'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import Scheduler from 'react-big-scheduler'
import 'react-big-scheduler/lib/css/style.css'
import withDragDropContext from './withDnDContext'

import styles from './index.less'

const FormItem = Form.Item
interface IFormComponentProps extends FormComponentProps {
  dispatch: any
  scheduler: any
  loading: any
}

interface IState {
  readonly options: []
  readonly viewModel: any
}

class AdScheduler extends React.PureComponent<IFormComponentProps, IState> {
  constructor(props) {
    super(props)
    // const {
    //   scheduler: { data },
    // } = this.props
    // const { resources, events, date } = data
    // moment.locale('zh-cn')
    // const schedulerData = new SchedulerData(
    //   moment(date).format(DATE_FORMAT),
    //   ViewTypes.Month,
    //   false,
    //   false,
    //   {
    //     headerEnabled: true,
    //     schedulerWidth: '100%',
    //     schedulerMaxHeight: 0,
    //     resourceName: '广告位序号',
    //     addMorePopoverHeaderFormat: 'YYYY年M月D日 dddd',
    //     eventItemPopoverDateFormat: 'M月D日',
    //     nonAgendaDayCellHeaderFormat: 'HH:mm',
    //     nonAgendaOtherCellHeaderFormat: 'ddd|M/D',
    //     startResizable: false,
    //     endResizable: false,
    //     movable: false,
    //     creatable: true,
    //     checkConflict: true,
    //     eventItemHeight: 122,
    //     eventItemLineHeight: 124,
    //     weekCellWidth: 100,
    //     monthCellWidth: 100,
    //     scrollToSpecialMomentEnabled: true,
    //     views: [],
    //   },
    //   {
    //     getDateLabelFunc: this.getDateLabel,
    //     isNonWorkingTimeFunc: this.isNonWorkingTime,
    //     getScrollSpecialMomentFunc: this.getScrollSpecialMoment,
    //   }
    // )
    // schedulerData.setLocaleMoment(moment)
    // schedulerData.setResources(resources)
    // schedulerData.setEvents(events)
    this.resize = debounce(this.resize, 400)
  }

  readonly state: IState = {
    options: [],
    viewModel: null,
  }

  leaflet = null

  resize = () => {
    const width = this.leaflet.offsetWidth
    const {
      scheduler: { data },
    } = this.props
    const { resources, events, date } = data
    if (resources.length > 0) {
      const schedulerData = new SchedulerData(
        moment(date).format(DATE_FORMAT),
        ViewTypes.Month,
        false,
        false,
        {
          headerEnabled: false,
          schedulerWidth: width,
          schedulerMaxHeight: 0,
          resourceName: '广告序号',
          addMorePopoverHeaderFormat: 'YYYY年M月D日 dddd',
          eventItemPopoverDateFormat: 'M月D日',
          nonAgendaDayCellHeaderFormat: 'HH:mm',
          nonAgendaOtherCellHeaderFormat: 'ddd|M/D',
          startResizable: false,
          endResizable: false,
          movable: false,
          creatable: true,
          checkConflict: true,
          eventItemHeight: 122,
          eventItemLineHeight: 124,
          weekCellWidth: 100,
          monthCellWidth: 100,
          scrollToSpecialMomentEnabled: true,
          views: [],
          eventItemPopoverEnabled: false,
        },
        {
          getDateLabelFunc: this.getDateLabel,
          isNonWorkingTimeFunc: this.isNonWorkingTime,
          getScrollSpecialMomentFunc: this.getScrollSpecialMoment,
        }
      )
      schedulerData.setLocaleMoment(moment)
      schedulerData.setResources(resources)
      schedulerData.setEvents(events)
      this.setState({
        viewModel: schedulerData,
      })
    }
  }

  getDateLabel = (schedulerData, viewType, startDate, endDate) => {
    const start = schedulerData.localeMoment(startDate)
    const end = schedulerData.localeMoment(endDate)
    let dateLabel = start.format('YYYY年M月D日')

    if (viewType === ViewTypes.Week) {
      dateLabel = `${start.format('YYYY年M月D日')}-${end.format('D日')}`
      if (start.month() !== end.month())
        dateLabel = `${start.format('YYYY年M月D日')}-${end.format('M月D日')}`
      if (start.year() !== end.year())
        dateLabel = `${start.format('YYYY年M月D日')}-${end.format('YYYY年M月D日')}`
    } else if (viewType === ViewTypes.Month) {
      dateLabel = start.format('YYYY年M月')
    } else if (viewType === ViewTypes.Quarter) {
      dateLabel = `${start.format('YYYY年M月D日')}-${end.format('M月D日')}`
    } else if (viewType === ViewTypes.Year) {
      dateLabel = start.format('YYYY年')
    }

    return dateLabel
  }

  getScrollSpecialMoment = schedulerData => {
    const {
      scheduler: { data },
    } = this.props
    const { date } = data
    const { localeMoment } = schedulerData
    return localeMoment(date)
  }

  isNonWorkingTime = () => false

  componentDidMount() {
    const { dispatch } = this.props

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

    window.addEventListener('resize', this.resize, false)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.scheduler !== nextProps.scheduler) {
      const {
        scheduler: { data },
      } = nextProps
      const { resources, events, date } = data
      if (events.length > 0) {
        const width = this.leaflet.offsetWidth
        const schedulerData = new SchedulerData(
          moment(date).format(DATE_FORMAT),
          ViewTypes.Month,
          false,
          false,
          {
            headerEnabled: false,
            schedulerWidth: width,
            schedulerMaxHeight: 0,
            resourceName: '广告序号',
            addMorePopoverHeaderFormat: 'YYYY年M月D日 dddd',
            eventItemPopoverDateFormat: 'M月D日',
            nonAgendaDayCellHeaderFormat: 'HH:mm',
            nonAgendaOtherCellHeaderFormat: 'ddd|M/D',
            startResizable: false,
            endResizable: false,
            movable: false,
            creatable: true,
            checkConflict: true,
            eventItemHeight: 122,
            eventItemLineHeight: 124,
            weekCellWidth: 100,
            monthCellWidth: 100,
            scrollToSpecialMomentEnabled: true,
            views: [],
          },
          {
            getDateLabelFunc: this.getDateLabel,
            isNonWorkingTimeFunc: this.isNonWorkingTime,
            getScrollSpecialMomentFunc: this.getScrollSpecialMoment,
          }
        )
        schedulerData.setLocaleMoment(moment)
        schedulerData.setResources(resources)
        schedulerData.setEvents(events)
        this.setState({
          viewModel: schedulerData,
        })
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
  }

  handleSearch = e => {
    e.preventDefault()

    const { dispatch, form } = this.props

    form.validateFields((err, fieldsValue) => {
      if (err) return

      let [mediaId, channelId, placeId] = [undefined, undefined, undefined]

      if (fieldsValue.place) {
        ;[mediaId, channelId, placeId] = fieldsValue.place
      }

      const startDate = fieldsValue.startDate
        ? fieldsValue.startDate.format('YYYY-MM-DD 00:00:00')
        : undefined

      delete fieldsValue.place

      const values = {
        ...fieldsValue,
        mediaId,
        channelId,
        placeId,
        startDate,
      }

      dispatch({
        type: 'scheduler/fetch',
        payload: values,
      })
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

  prevClick = schedulerData => {
    const { dispatch } = this.props
    dispatch({
      type: 'scheduler/fetch',
      payload: {
        startDate: moment(schedulerData.selectDate)
          .subtract(1, 'month')
          .format(DATE_FORMAT),
      },
    })
  }

  nextClick = schedulerData => {
    const { dispatch } = this.props
    dispatch({
      type: 'scheduler/fetch',
      payload: {
        startDate: moment(schedulerData.selectDate)
          .add(1, 'month')
          .format(DATE_FORMAT),
      },
    })
  }

  onViewChange = (schedulerData, view) => {
    const {
      scheduler: { data },
    } = this.props
    schedulerData.setViewType(view.viewType, view.showAgenda, view.isEventPerspective)
    schedulerData.setEvents(data.events)
    this.setState({
      viewModel: schedulerData,
    })
  }

  onSelectDate = (schedulerData, date) => {
    const { dispatch } = this.props
    dispatch({
      type: 'scheduler/fetch',
      payload: {
        startDate: date.format(DATE_FORMAT),
      },
    })
  }

  eventClicked = (schedulerData, event) => {
    alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`)
  }

  newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
    const { form } = this.props
    const { dispatch } = this.props
    const startDate = moment(start).format(DATE_FORMAT)
    const endDate = moment(end).format(DATE_FORMAT)
    const position = slotId
    const params = {
      startDate,
      endDate,
      position,
      place: form.getFieldValue('place') && form.getFieldValue('place').toString(),
    }
    dispatch(routerRedux.push(`/advert/create?${stringify(params)}`))
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props
    const { options } = this.state
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={15} sm={24}>
            <FormItem label="广告位">
              {getFieldDecorator('place', {
                rules: [{ required: true, message: '请选择广告位！' }],
              })(
                <Cascader
                  options={options}
                  loadData={this.loadData}
                  style={{ width: '100%' }}
                  placeholder="请选择广告位"
                  allowClear
                  changeOnSelect
                />
              )}
            </FormItem>
          </Col>
          <Col md={7} sm={24}>
            <FormItem label="开始日期">
              {getFieldDecorator('startDate')(
                <DatePicker placeholder="请输入选择日期" style={{ width: '100%' }} />
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

  eventItemTemplateResolver = () => (
    schedulerData,
    event,
    bgColor,
    isStart,
    isEnd,
    mustAddCssClass,
    mustBeHeight,
    agendaMaxEventWidth
  ) => {
    const borderWidth = isStart ? '4' : '0'
    let borderColor = 'rgba(0,139,236,1)'
    let backgroundColor = event.bgColor || '#80C5F6'
    console.log(event.bgColor)
    let divStyle = {
      borderLeft: `${borderWidth}px solid ${borderColor}`,
      backgroundColor,
      height: mustBeHeight,
    }
    if (agendaMaxEventWidth) divStyle = { ...divStyle, maxWidth: agendaMaxEventWidth }
    return (
      <div key={event.id} className={mustAddCssClass} style={divStyle}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            paddingLeft: 5,
            height: mustBeHeight,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              {event.status}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
            <div>{event.rankDate}</div>
          </div>
          <div style={{ textAlign: 'center' }}>{event.title}</div>
          <div>
            <img src={event.url} alt={event.title} style={{ width: 80, height: 40 }} />
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { loading } = this.props
    const { viewModel } = this.state
    return (
      <PageHeaderWrapper title="广告排期">
        <Card bordered={false}>
          <div>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div
              ref={leaflet => {
                this.leaflet = leaflet
              }}
            >
              {viewModel ? (
                loading ? (
                  <div
                    style={{
                      textAlign: 'center',
                      minHeight: '600px',
                      lineHeight: '600px',
                    }}
                  >
                    <Spin size="large" />
                  </div>
                ) : (
                  <Scheduler
                    schedulerData={viewModel}
                    onViewChange={this.onViewChange}
                    prevClick={this.prevClick}
                    nextClick={this.nextClick}
                    onSelectDate={this.onSelectDate}
                    eventItemClick={this.eventClicked}
                    newEvent={this.newEvent}
                    eventItemTemplateResolver={this.eventItemTemplateResolver()}
                  />
                )
              ) : (
                <Empty description="暂无数据,请先选择广告位" />
              )}
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

const mapStateToProps = state => ({
  scheduler: state.scheduler,
  loading: state.loading.models.scheduler,
})

export default connect(mapStateToProps)(Form.create()(withDragDropContext(AdScheduler)))
