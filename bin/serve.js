#!/usr/bin/env node

const fs = require('fs')
const homedir = require('os').homedir()
const exec = require('child_process').exec
const handler = require('serve-handler')
const http = require('http')

function getPrivKey() {
  try {
    const fetchHeadDir = './.git/'
    var fetchHeadFile = fetchHeadDir + 'FETCH_HEAD'

    var fetchHead = fs.readFileSync(fetchHeadFile).toString()

    var repo = fetchHead
      .split(' ')
      .pop()
      .replace(':', '/')
      .replace('\n', '')

    const gitmarkRepoBase = homedir + '/.gitmark/repo'

    const gitmarkFile = gitmarkRepoBase + '/' + repo + '/gitmark.json'

    return require(gitmarkFile).privkey58
  } catch (e) {
    const fetchHeadDir = './.git/'
    var fetchHeadFile = fetchHeadDir + 'FETCH_HEAD'

    var fetchHead = fs.readFileSync(fetchHeadFile).toString()

    var repo = fetchHead
      .split(' ')
      .pop()
      .replace(':', '/')
      .replace('\n', '')

    const gitmarkRepoBase = homedir + '/.gitmark/repo'

    const gitmarkFile = gitmarkRepoBase + '/' + repo + '/gitmark.json'

    console.log('no priv key found in', gitmarkFile)
    return undefined
  }
}

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
    if (
      object.hasOwnProperty(property) &&
      property.toString().startsWith(prefix)
    ) {
      return { k: property, v: object[property] }
    }
  }
}

function withdrawToAddress(address) {
  const amount = 1000
  const fee = 10
  const pubkey = 'bLSMWcELqH9Y9ajmNuSrwbTCUVzJ94YpTb'
  const serverCmd = 'ssh -i ~/.ssh/id_btm ubuntu@157.90.144.229'

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
  var txo = findValueByPrefix(ledger, 'txo:')
  if (!txo) {
    console.error('no txo found')
    return
  }
  console.log('txo:', txo)

  // get amounts
  var newamount = txo.v - (amount + fee)

  // get key
  var key = getPrivKey()
  console.log(key)

  // translate key into base58address

  // build tx
  // TODO: round division
  var createrawtransaction = `${serverCmd} bin/txc.sh ${txo.k.split(':')[1]
    } ${txo.k.split(':')[2]} ${address} ${amount / 1000000} ${key} ${pubkey} ${newamount / 1000000}`
  console.log(createrawtransaction)

  // trap response
  exec(createrawtransaction, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }
    console.log(`stdout: ${stdout}`)
    console.error(`stderr: ${stderr}`)
    stdout = stdout.replace('\n', '')
    var newtxo = `txo:${stdout}:1`
    console.log('newtxo', newtxo)
    if (stdout && stdout.length === 64) {
      // if successful update ledger
      // subtract txo
      delete ledger[txo.k]
      ledger[address] = amount
      ledger[newtxo] = newamount
      // write ledger
      console.log('ledger', JSON.stringify(ledger, null, 2))
      fs.writeFileSync(ledgerFile, JSON.stringify(ledger, null, 2))
    }
  })
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
