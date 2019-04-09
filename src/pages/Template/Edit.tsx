import React, { useEffect, useState } from 'react'
import { connect } from 'dva'
import { Form, Input, Button, Card, Row, Col, Tabs, message, Select } from 'antd'
import { routerRedux } from 'dva/router'
import { FormComponentProps } from 'antd/lib/form/Form'
import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import CustomCodemirror from '@/components/CustomCodemirror'
import { mergeTemplate, splitTemplate } from '@/utils/utils'
import { IFormField } from '@/pages/Template/List'

import './index.less'

const FormItem = Form.Item
const { TabPane } = Tabs
const { Option } = Select

interface IFormComponentProps extends FormComponentProps {
  dispatch: IDispatch
  template: ITemplateStore
  submitting: boolean
  match: any
}

const TemplateEdit: React.SFC<IFormComponentProps> = props => {
  const [typeList, setTypeList] = useState([])
  useEffect(() => {
    const { dispatch, match } = props
    if (!match.params.id) {
      message.error('缺少参数：id', 1, () => {
        dispatch(routerRedux.push('/template/list'))
      })
    }
    dispatch({
      type: 'template/fetchById',
      payload: {
        id: match.params.id,
      },
    })
    dispatch({
      type: 'placeType/fetch',
      payload: {
        currentPage: 1,
        pageSize: 999,
      },
      callback: res => {
        setTypeList(res.data.list)
      },
    })
  }, [])

  const {
    form: { getFieldDecorator },
    template: { data },
    submitting,
  } = props

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 7 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 12 },
      md: { span: 10 },
    },
  }

  const submitFormLayout = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 10, offset: 7 },
    },
  }

  const {content} = data.current

  const { html, css, js } = splitTemplate(content)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { dispatch, form, match } = props
    form.validateFields((err: any, values: IFormField) => {
      if (!err) {
        const content = mergeTemplate({ html: values.html, css: values.css, js: values.js })
        delete values.html
        delete values.js
        delete values.css
        dispatch({
          type: 'template/edit',
          payload: {
            id: match.params.id,
            params: { ...values, content, id: match.params.id },
          },
          callback: () => {
            message.success('提交成功，请预览确认该段代码')
          },
        })
      }
    })
  }

  const goBack = () => {
    const { dispatch } = props
    dispatch(routerRedux.goBack())
  }

  return (
    <PageHeaderWrapper title="基础模板编辑">
      <Card bordered={false}>
        <Form onSubmit={handleSubmit} style={{ marginTop: 8 }}>
          <FormItem {...formItemLayout} label="基础模板名称">
            {getFieldDecorator('name', {
              initialValue: data.current.name || '',
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入基础模板名称',
                },
              ],
            })(<Input placeholder="请输入基础模板名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="广告位类型">
            {getFieldDecorator('placeTypeId', {
              initialValue: data.current.placeTypeId || [],
              rules: [{ required: true, message: '请选择广告位类型！' }],
            })(
              <Select placeholder="请选择广告位类型" style={{ width: '100%' }}>
                {typeList.map((x: any) => (
                  <Option key={x.id} value={x.id}>
                    {x.name}
                  </Option>
                ))}
              </Select>
            )}
          </FormItem>
          <Row>
            <Col>
              <Tabs defaultActiveKey="1">
                <TabPane tab="HTML" key="1">
                  {getFieldDecorator('html', {
                    initialValue: html || '',
                    rules: [
                      {
                        required: false,
                        message: '请输入HTML代码',
                      },
                    ],
                  })(
                    <CustomCodemirror
                      mode="html"
                      placeholder="请输入HTML代码"
                      style={{ width: '100%' }}
                    />
                  )}
                </TabPane>
                <TabPane tab="JS" key="2">
                  {getFieldDecorator('js', {
                    initialValue: js || '',
                    rules: [
                      {
                        required: false,
                        message: '请输入JS代码',
                      },
                    ],
                  })(
                    <CustomCodemirror
                      mode="js"
                      placeholder="请输入JS代码"
                      style={{ width: '100%' }}
                    />
                  )}
                </TabPane>
                <TabPane tab="CSS" key="3">
                  {getFieldDecorator('css', {
                    initialValue: css || '',
                    rules: [
                      {
                        required: false,
                        message: '请输入CSS代码',
                      },
                    ],
                  })(
                    <CustomCodemirror
                      mode="css"
                      placeholder="请输入CSS代码"
                      style={{ width: '100%' }}
                    />
                  )}
                </TabPane>
              </Tabs>
            </Col>
          </Row>
          <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
            <Button type="primary" htmlType="submit" loading={submitting}>
              提交
            </Button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <Button onClick={goBack} loading={submitting}>
              返回
            </Button>
          </FormItem>
        </Form>
      </Card>
    </PageHeaderWrapper>
  )
}

const mapStateToProps = (state: IStore) => ({
  template: state.template,
  submitting: state.loading.effects['template/edit'],
})

export default connect(mapStateToProps)(Form.create()(TemplateEdit))
