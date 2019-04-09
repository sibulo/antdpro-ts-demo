import React, { PureComponent } from 'react'
import TableDragSelect from 'dfws-react-table-drag-select'
import 'dfws-react-table-drag-select/style.css'
import { isArray } from 'util'

export default class PlaceDragTable extends PureComponent {
  render() {
    const { value, onChange, drag } = this.props

    let width = 80

    if (isArray(value[0])) {
      for (let i = 0; i < value[0].length; i += 1) {
        if (i > 4) {
          width = '100%'
        } else {
          width = 80 * (i + 1)
        }
      }
    }

    return (
      <>
        <TableDragSelect
          unselectConfig={{
            text: '未投放',
            bgColor: '#339999',
            color: '#FFF',
          }}
          drag={drag}
          onChange={onChange}
          width={width}
          value={value}
        >
          {value.map((item, i) => (
            <tr key={i}>
              {item.map((x, k) => (
                <td key={k} />
              ))}
            </tr>
          ))}
        </TableDragSelect>
      </>
    )
  }
}
