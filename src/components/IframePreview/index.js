import React, { PureComponent } from 'react'

export default class IframePreview extends PureComponent {
  constructor(props) {
    super(props)
    this.iframe = null
  }

  state = {}

  componentDidMount() {
    this.handleUpdateIframe()
  }

  componentDidUpdate() {
    this.handleUpdateIframe()
  }

  refIframe = el => {
    this.iframe = el
  }

  handleUpdateIframe = () => {
    const { html, js, css } = this.props
    if (html) {
      const { iframe } = this
      const content = `<div style="margin-top:30px;">${html}<style>${css}</style></div>`
      const iwindow = iframe.contentWindow
      const document = iframe.contentDocument
      document.body.innerHTML = content
      const s = document.getElementsByTagName('script')[0]
      if (!s) {
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.async = true
        script.src = '//lib.baomitu.com/jquery/1.9.1/jquery.js'
        document.querySelector('head').appendChild(script)
        // eslint-disable-next-line no-multi-assign
        script.onload = script.onreadystatechange = () => {
          const rdyState = script.readyState
          if (!rdyState || /complete|loaded/.test(script.readyState)) {
            iwindow.eval(js)
            script.onload = null
            script.onreadystatechange = null
          }
        }
      }
    }
  }

  render() {
    return (
      <iframe
        title="预览"
        frameBorder="0"
        style={{ overflow: 'hidden', height: 300, width: 600 }}
        src="about:blank"
        ref={this.refIframe}
      />
    )
  }
}
