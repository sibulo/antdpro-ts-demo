import React, { useState, useEffect } from 'react'
import { connect } from 'dva'
import { routerRedux } from 'dva/router'
import moment from 'moment'
import { Row, Col, Card, Form, Button, DatePicker, Table, Alert, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'

import styles from './List.less'

const FormItem = Form.Item
const { RangePicker } = DatePicker

const getValue = (obj: object) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',')

interface IFormComponentProps extends FormComponentProps {
  match: any
  dispatch: any
  stats: any
  loading: any
}

const Stats: React.SFC<IFormComponentProps> = props => {
  const {
    dispatch,
    match,
    form,
    stats: { data },
    loading,
  } = props

  const [formValues, setFormValues] = useState({})

  useEffect(() => {
    if (!match.params.id) {
      message.error('缺少参数：id')
      setTimeout(() => {
        dispatch(routerRedux.push('/advert/list'))
      }, 1500)
    }
    dispatch({
      type: 'stats/fetch',
      payload: {
        adid: match.params.id,
      },
    })
  }, [])

  const columns = [
    {
      title: '日期',
      dataIndex: 'date',
      render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
    },
    {
      title: '展示次数',
      dataIndex: 'impression',
    },
    {
      title: '点击次数',
      dataIndex: 'clickThrough',
    },
    {
      title: '点击率',
      dataIndex: 'clickThroughRate',
    },
    {
      title: '点击人数',
      dataIndex: 'IP',
    },
  ]
  const handleStandardTableChange = (pagination: any, filtersArg: any, sorter: any) => {
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
      type: 'stats/fetch',
      payload: params,
    })
  }

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    form.validateFields((err, fieldsValue) => {
      if (err) return

      const { date } = fieldsValue

      const values = {
        ...fieldsValue,
        date: [date[0].format('YYYY-MM-DD'), date[1].format('YYYY-MM-DD')],
      }

      setFormValues(values)

      dispatch({
        type: 'stats/fetch',
        payload: values,
      })
    })
  }

  const renderForm = () => {
    const {
      form: { getFieldDecorator },
    } = props
    return (
      <Form onSubmit={handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="公司名称">杭州清风公司</FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="所属媒体">最佳东方</FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="广告位置">APP - 首页黄金展位（240 * 60）</FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="广告类型">付费广告</FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="选择日期">
              {getFieldDecorator('date', {})(
                <RangePicker style={{ flexGrow: 1 }} placeholder={['开始时间', '结束时间']} />
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
          <Col md={2} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                导出查询结果
              </Button>
            </span>
          </Col>
          <Col md={12} sm={24} />
        </Row>
      </Form>
    )
  }

  const paginationProps = {
    showSizeChanger: true,
    showQuickJumper: true,
    ...data.pagination,
  }

  return (
    <PageHeaderWrapper title="广告统计">
      <Card bordered={false}>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>{renderForm()}</div>
          <div className={styles.tableAlert}>
            <Alert
              message={
                <div>
                  总点击次数：<b>1234</b> 总点击人数：<b>11223</b> 平均点击率：<b>19%</b>
                </div>
              }
              type="info"
              showIcon
            />
          </div>
          <Table
            loading={loading}
            dataSource={data.list}
            pagination={paginationProps}
            columns={columns}
            onChange={handleStandardTableChange}
          />
          <div style={{ textAlign: 'right' }} />
        </div>
      </Card>
    </PageHeaderWrapper>
  )
}

const mapStateToProps = (state: any) => ({
  stats: state.stats,
  loading: state.loading.models.stats,
})

export default connect(mapStateToProps)(Form.create()(Stats))
