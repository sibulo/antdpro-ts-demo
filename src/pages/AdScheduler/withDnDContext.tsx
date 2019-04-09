import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'

const withDragDropContext =  DragDropContext(HTML5Backend)

export default withDragDropContext
