import * as React from 'react'
import { Row, Col, Form, Modal, Tabs } from 'antd'
import { FormComponentProps } from 'antd/lib/form/Form'
import CustomCodemirror from '@/components/CustomCodemirror'
import { mergeTemplate, splitTemplate } from '@/utils/utils'

const { TabPane } = Tabs

interface IFormComponentProps extends FormComponentProps {
  modalTemplateVisible: boolean
  templates: string
  handleModalTemplateVisible: () => void
  handleTemplateUpdate: (arg: any) => void
}

const CreateTemplate: React.SFC<IFormComponentProps> = props => {
  const {
    modalTemplateVisible,
    handleModalTemplateVisible,
    handleTemplateUpdate,
    templates,
    form,
  } = props
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      const content = mergeTemplate({
        html: fieldsValue.html,
        css: fieldsValue.css,
        js: fieldsValue.js,
      })
      handleTemplateUpdate(content)
    })
  }
  const { html, css, js } = splitTemplate(templates)
  return (
    <Modal
      destroyOnClose
      title="广告位模板"
      visible={modalTemplateVisible}
      maskClosable={false}
      width={960}
      onOk={okHandle}
      onCancel={() => handleModalTemplateVisible()}
    >
      <Row>
        <Col>
          <Tabs defaultActiveKey="1">
            <TabPane tab="HTML" key="1">
              {form.getFieldDecorator('html', {
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
              {form.getFieldDecorator('js', {
                initialValue: js || '',
                rules: [
                  {
                    required: false,
                    message: '请输入JS代码',
                  },
                ],
              })(
                <CustomCodemirror mode="js" placeholder="请输入JS代码" style={{ width: '100%' }} />
              )}
            </TabPane>
            <TabPane tab="CSS" key="3">
              {form.getFieldDecorator('css', {
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
    </Modal>
  )
}

export default Form.create()(CreateTemplate)
