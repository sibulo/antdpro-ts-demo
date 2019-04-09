import React, { useState, useEffect } from 'react'
import { Input, Button, Modal, Row, Col, List, Radio, message } from 'antd'
import { connect } from 'dva'
import { FormComponentProps, WrappedFormUtils } from 'antd/lib/form/Form'
import RadioGroup from 'antd/lib/radio/group'
import { IFormField } from '@/pages/Rebase/List'

import styles from './Uploader.less'

interface IFormComponentProps extends FormComponentProps {
  dispatch: IDispatch
  current: IRebaseModel
  from: WrappedFormUtils
  modalUploaderVisible: boolean
  handleModalUploaderVisible: () => void
}

const Uploader: React.SFC<IFormComponentProps> = props => {
  const [search, setSearch] = useState('')
  const [materialList, setMaterialList] = useState([])

  useEffect(() => {
    const { dispatch } = props
    dispatch({
      type: 'material/fetch',
      payload: {
        currentPage: 1,
        pageSize: 9999,
        type: 1,
      },
      callback: res => {
        setMaterialList(res.data.list)
      },
    })
  }, [])

  const handleSearchClick = () => {
    const { dispatch } = props
    if (search) {
      dispatch({
        type: 'material/fetch',
        payload: {
          name: search,
          type: 1,
          currentPage: 1,
          pageSize: 9999,
        },
        callback: res => {
          setMaterialList(res.data.list)
        },
      })
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const okHandle = () => {
    const { form, handleModalUploaderVisible } = props
    form.validateFields((err, fieldsValue: IFormField) => {
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

  const { form, modalUploaderVisible, current, handleModalUploaderVisible } = props

  return (
    <Modal
      destroyOnClose
      title="广告图片"
      visible={modalUploaderVisible}
      onOk={okHandle}
      width={760}
      onCancel={() => handleModalUploaderVisible()}
    >
      <Row gutter={16}>
        <Col className="gutter-row" span={12}>
          <Input placeholder="请输入文件名称" onChange={handleSearchChange} />
        </Col>
        <Col className="gutter-row" span={6}>
          <Button type="primary" icon="search" onClick={handleSearchClick}>
            搜索
          </Button>
        </Col>
      </Row>

      <Row style={{ marginTop: 16 }} gutter={16}>
        {form.getFieldDecorator('selected', {
          initialValue: current ? current.selected : '',
        })(
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

export default connect()(Uploader)
