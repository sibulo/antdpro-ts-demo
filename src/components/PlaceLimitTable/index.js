import React, { PureComponent } from 'react'
import { Icon, Row, Col, Button } from 'antd'
import TableDragSelect from 'dfws-react-table-drag-select'

export default class PlaceLimitTable extends PureComponent {
  render() {
    const {
      handleRowRemove,
      handleRowAdd,
      handleColRemove,
      handleColAdd,
      currentCells,
      code,
    } = this.props

    let result = []
    let renderResult = null
    let width = 80

    if (currentCells[0].length > 6) {
      width = '100%'
    } else if (code === 'CAROUSEL' || code === 'GRID') {
      width = 80 * currentCells[0].length
    } else {
      width = 80
    }

    const render0 = () =>
      result.map((item, i) => (
        <tr key={i}>
          {item.map((x, k) => (
            <td key={k} />
          ))}
        </tr>
      ))

    const render1 = () =>
      result.map((item, i) => (
        <tr key={i}>
          {item.map((x, k) => {
            if (i === 0) {
              return (
                <td disabled key={k} style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                  <Icon
                    type="delete"
                    onClick={e => {
                      e.preventDefault()
                      handleColRemove(k)
                    }}
                  />
                </td>
              )
            }
            return <td key={k} />
          })}
        </tr>
      ))

    const render2 = () =>
      result.map((item, i) => (
        <tr key={i}>
          {item.map((x, k) =>
            item.length === k + 1 ? (
              <td disabled key={k} style={{ backgroundColor: '#fff', cursor: 'pointer' }}>
                <Icon
                  type="delete"
                  onClick={e => {
                    e.preventDefault()
                    handleRowRemove(i)
                  }}
                />
              </td>
            ) : (
              <td key={k} />
            )
          )}
        </tr>
      ))

    switch (code) {
      case 'NORMAL':
        result = currentCells
        renderResult = render0
        break
      case 'CAROUSEL':
        result = [
          currentCells[0].map(() => ({
            value: false,
            disabled: true,
            text: '未使用',
          })),
        ].concat(currentCells)
        renderResult = render1
        break
      case 'GRID':
        result = currentCells.map(x =>
          x.concat([
            {
              value: false,
              disabled: true,
              text: '未使用',
            },
          ])
        )
        renderResult = render2
        break
      default:
        break
    }

    return (
      <>
        {code === 'CAROUSEL' && (
          <Row gutter={16}>
            <Col span={8} />
            <Col span={8} />
            <Col span={8} style={{ textAlign: 'right' }}>
              <Button icon="plus" type="primary" onClick={() => handleColAdd()}>
                新增列
              </Button>
            </Col>
          </Row>
        )}
        {code === 'GRID' && (
          <React.Fragment>
            <Row style={{ marginTop: 20 }} gutter={16}>
              <Col span={8} />
              <Col span={8} />
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button icon="plus" type="primary" onClick={() => handleRowAdd()}>
                  新增行
                </Button>
              </Col>
            </Row>
          </React.Fragment>
        )}
        <TableDragSelect width={width} value={result}>
          {renderResult()}
        </TableDragSelect>
      </>
    )
  }
}
