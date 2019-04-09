import React, { PureComponent } from 'react'
import { Input, Button, Modal, Row, Col, List, Radio, Card, message } from 'antd'
import { connect } from 'dva'
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form'
import RadioGroup from 'antd/lib/radio/group'

import styles from './Uploader.less'

interface IFormComponentProps extends FormComponentProps {
  dispatch: any
  currentFile: any
  from: WrappedFormUtils
  modalUploaderVisible: boolean
  handleModalUploaderVisible: () => void
}

interface IState {
  readonly search: string
  readonly materialList: []
}

class Uploader extends PureComponent<IFormComponentProps, IState> {
  readonly state: IState = {
    search: '',
    materialList: [],
  }

  handleSearchClick = () => {
    const { dispatch, currentFile } = this.props
    const { search } = this.state
    if (search) {
      dispatch({
        type: 'material/fetch',
        payload: {
          name: search,
          type: 1,
          currentPage: 1,
          pageSize: 9999,
          advId: currentFile.advId,
          width: currentFile.width,
          height: currentFile.height,
        },
        callback: res => {
          this.setState({
            materialList: res.data.list,
          })
        },
      })
    }
  }

  handleSearchChange = e => {
    this.setState({
      search: e.target.value,
    })
  }

  componentWillReceiveProps(nextProps) {
    const { dispatch, currentFile } = nextProps
    if (this.props.modalUploaderVisible !== nextProps.modalUploaderVisible) {
      if (nextProps.modalUploaderVisible) {
        dispatch({
          type: 'material/fetch',
          payload: {
            type: 1,
            currentPage: 1,
            pageSize: 9999,
            advId: currentFile.advId,
            width: currentFile.width,
            height: currentFile.height,
          },
          callback: res => {
            this.setState({
              materialList: res.data.list,
            })
          },
        })
      }
    }
  }

  okHandle = () => {
    const { form, handleModalUploaderVisible } = this.props
    const { materialList } = this.state
    form.validateFields((err, fieldsValue) => {
      if (fieldsValue.selected) {
        const result: any = materialList.filter((x: any) => x.id === fieldsValue.selected)[0]
        form.setFieldsValue({
          materialId: result.id,
          materialUrl: result.url,
        })
        handleModalUploaderVisible()
      } else {
        message.error('请选择图片')
      }
    })
  }

  render() {
    const { form, modalUploaderVisible, handleModalUploaderVisible } = this.props

    const { materialList } = this.state

    return (
      <Modal
        destroyOnClose
        title="广告图片"
        visible={modalUploaderVisible}
        onOk={this.okHandle}
        width={760}
        onCancel={() => handleModalUploaderVisible()}
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={12}>
            <Input placeholder="请输入文件名称" onChange={this.handleSearchChange} />
          </Col>
          <Col className="gutter-row" span={6}>
            <Button type="primary" icon="search" onClick={this.handleSearchClick}>
              搜索
            </Button>
          </Col>
        </Row>

        <Row style={{ marginTop: 16 }} gutter={16}>
          {form.getFieldDecorator('selected', {})(
            <RadioGroup name="selectedImg">
              <List
                grid={{ gutter: 16, column: 3 }}
                dataSource={materialList}
                pagination={{
                  defaultPageSize: 9,
                  pageSize: 9,
                }}
                renderItem={item => (
                  <List.Item
                    style={{
                      height: 120,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    key={item.id}
                  >
                    <Radio value={item.id} className={styles['override-ant-radio']}>
                      <img
                        style={{ width: '100%' }}
                        src={`${item.url}?x-oss-process=image/resize,m_lfit,h_100,w_200`}
                      />
                    </Radio>
                  </List.Item>
                )}
              />
            </RadioGroup>
          )}
        </Row>
      </Modal>
    )
  }
}

export default connect()(Uploader)
