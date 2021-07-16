import { html } from 'https://unpkg.com/spux?module'

const Dot = (i, j, row) => {
  var amount = Math.floor(i / 41)
  if (amount > 9) amount = 9
  if (!amount) amount = 0
  var red = Math.floor((amount * 255) / 9)
  var color =
    j === new Date().getUTCHours() || row === new Date().getUTCDay()
      ? 'blue'
      : 'blue'
  var opacity =
    j === new Date().getUTCHours() || row === new Date().getUTCDay()
      ? '0.5'
      : '0.1'
  return html`
    <circle
      cx="${20 * j + 10}"
      cy="${20 * row + 10}"
      r="${amount}"
      stroke="black"
      stroke-width="0"
      fill="rgb(${red},${255 - red}, 0)"
    >
      <title>${i}</title>
    </circle>

    <rect
      width="20"
      height="20"
      x="${20 * j}"
      y="${20 * row}"
      style="stroke:${color};stroke-width:1;fill-opacity:0.01;stroke-opacity:${opacity}"
    >
      <title>${i}</title>
    </rect>
  `
}

export default Dot
