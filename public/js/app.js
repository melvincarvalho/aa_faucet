import { html, render } from '../js/spux.js'
import Navbar from '../components/Navbar.js'

const creditsUri = './webcredits/webcredits.json'

globalThis.spux = {}
spux.month = []
spux.monthTotal = 0
spux.year = []
spux.yearTotal = 0
spux.items = []
spux.totals = []
spux.amount = 10000

spux.date = new Date().getDate()

spux.all = []
spux.today = []

fetch(creditsUri)
  .then(response => response.json())
  .then(log => {
    console.log(log)

    renderAll()
  })

function renderAll() {

  render(
    html`
      <${Navbar} title="Welcome to Bitmark Faucet!" />

      <form>
      <div class="row">
      <h6>
      Available: ${spux.amount} marks per day per IP
      </h6>
      <label>Enter Withdrawal Address:</label>
      <br/>
      <input name="address" autofocus size="40" />
      <br/>
      <button>Withdraw ${spux.amount} marks!</button>
      </div>
      </form>

      `,
    document.body
  )
}

renderAll()
