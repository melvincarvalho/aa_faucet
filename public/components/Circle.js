import { Component, h, html, render } from 'https://unpkg.com/spux?module'

export default class Circle extends Component {
  constructor (props) {
    super(props)
    this.state = {
      amount: props.amount,
      hour: props.hour
    }
  }

  render () {
    return html`
      <svg width="300" height="300" viewBox="-25 -25 400 400">
        <${InnerCircle} />
        <${OuterCircle}
          amount="${this.props.amount}"
          hour="${this.props.hour}"
        />
        <${Text}
          amount="${Math.floor(this.props.amount / 30)}"
          hour="${this.props.hour}"
        />
      </svg>
    `
  }
}

const InnerCircle = props => html`
  <circle
    cx="175"
    cy="175"
    stroke="Moccasin"
    fill="none"
    stroke-width="40"
    r="175"
  ></circle>
`

class OuterCircle extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    return html`
      <circle
        cx="175"
        cy="175"
        stroke-dashoffset="1100"
        stroke-dasharray="1100"
        stroke="${'rgb(' +
          (this.props.hour * 255) / 410.0 +
          ', ' +
          ((410 - this.props.hour) * 255) / 410.0 +
          ', 0)'}"
        transform="rotate(-90 175 175)"
        fill="none"
        stroke-width="30"
        stroke-linecap="round"
        r="175"
        style="stroke-dashoffset : ${((360 - this.props.amount) * 1100) /
          360} ; transition: all 1s ease-out 0s"
      ></circle>
    `
  }
}

const Text = props => html`
  <text
    fill=${'rgb(' +
      ((props.hour % 410) * 255) / 410.0 +
      ', ' +
      ((410 - (props.hour % 410)) * 255) / 410.0 +
      ', 0)'}
    x="50%"
    y="50%"
    dx="-25"
    text-anchor="middle"
    style=${{
      font: 'bold 5rem Helvetica, Arial, sans-serif'
    }}
  >
    ${props.amount}
  </text>
`
