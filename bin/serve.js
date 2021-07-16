#!/usr/bin/env node

const handler = require('serve-handler')
const http = require('http')
var port = 5000
var root = '.'
var options = {}
try {
  const configFile = process.cwd() + '/config/skill-serve.json'
  console.log('config file', configFile)
  const config = require(configFile)
  console.log('config', config)
  if (config && config.port) {
    port = config.port
  }
  if (config && config.root) {
    root = config.root
    options.public = root
  }
  console.log('options', options)
} catch (e) {
  console.error(e)
}

function findValueByPrefix(object, prefix) {
  for (var property in object) {
    if (object.hasOwnProperty(property) &&
      property.toString().startsWith(prefix)) {
      return object[property];
    }
  }
}


function withdrawToAddress(address) {
  const amount = 1000
  const fee = 10
  const pubkey = 'bLSMWcELqH9Y9ajmNuSrwbTCUVzJ94YpTb'

  // validate address
  if (address.length !== 34) {
    console.error('invalid address', address)
    return
  }

  // get ledger
  var ledgerFile = process.cwd() + '/webcredits/webledger.json'
  var ledger = require(ledgerFile)
  if (!ledger) {
    console.error('no ledger found at', ledgerFile)
    return
  }

  // check address not in ledger
  if (ledger[address]) {
    console.error('address already received', ledger[address])
    return
  }

  // get txo:
  var txo = findValueByPrefix(ledger, "txo:")
  if (!txo) {
    console.error('no txo found')
    return
  }
  console.log('txo:', txo)

  // get amounts
  var newamount = txo - (amount + fee)

  // build tx
  // TODO: round division
  var createrawtransaction = `txc.sh '[{"txid": "${txo}", "vout": 0}]' '{"${pubkey}": ${(newamount / 1000000)}, "${address}": 0.000001}' key`
  console.log(createrawtransaction)
  console.log('sign and send that!')

  // trap response

  // if successful update ledger
  // add bitmark address
  // subtract txo
  // write ledger

}

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/vercel/serve-handler#options
  const url = request.url
  console.log(url)
  if (url.match(/\?address=/)) {
    console.log('withdraw')
    const address = url.split('=')[1]
    console.log('address', address)
    withdrawToAddress(address)
    return handler(request, response, options)
  } else {
    return handler(request, response, options)
  }
})

server.listen(port, () => {
  console.log('Running at http://localhost:' + port)
})
