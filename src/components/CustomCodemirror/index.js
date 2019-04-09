import React, { Component } from 'react'
import { Controlled as CodeMirror } from 'react-codemirror2'
import PropTypes from 'prop-types'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/display/fullscreen.css'
import 'codemirror/addon/fold/foldgutter.css'

import 'codemirror/mode/javascript/javascript'
import 'codemirror/mode/htmlmixed/htmlmixed'
import 'codemirror/mode/css/css'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/display/fullscreen'
import 'codemirror/addon/fold/foldcode'
import 'codemirror/addon/fold/foldgutter'
import 'codemirror/addon/fold/brace-fold'
import 'codemirror/addon/fold/comment-fold'

import './index.less'

export default class CustomCodemirror extends Component {
  static displayName = 'CustomCodemirror'

  static propTypes = {
    mode: PropTypes.string,
    placeholder: PropTypes.string,
  }

  static defaultProps = {
    mode: 'js',
    placeholder: '请输入代码',
  }

  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        value: nextProps.value || '',
      }
    }
    return null
  }

  constructor(props) {
    super(props)
    const value = props.value || {}
    this.state = {
      value,
    }
  }

  onBeforeChange = (editor, data, value) => {
    if (!('value' in this.props)) {
      this.setState({ value })
    }
    const { onChange } = this.props
    if (onChange) {
      onChange(value)
    }
  }

  renderCodeMirror = () => {
    const { value, mode, placeholder } = this.props

    let m = 'js'

    switch (mode) {
      case 'js':
        m = 'javascript'
        break
      case 'html':
        m = 'text/html'
        break
      case 'css':
        m = 'css'
        break
      default:
        m = 'javascript'
        break
    }

    const options = {
      mode: m,
      lineNumbers: true,
      lineWrapping: true,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      tabSize: '2',
      placeholder,
      extraKeys: {
        F11: cm => {
          cm.setOption('fullScreen', !cm.getOption('fullScreen'))
        },
        Esc: cm => {
          if (cm.getOption('fullScreen')) cm.setOption('fullScreen', false)
        },
      },
    }

    return <CodeMirror value={value} options={options} onBeforeChange={this.onBeforeChange} />
  }

  render() {
    return <div>{this.renderCodeMirror()}</div>
  }
}
