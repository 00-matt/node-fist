const EventEmitter = require('events')
const stream = require('stream')
const util = require('util')

const net = jest.genMockFromModule('net')

function noop () {}

net.Socket = class extends EventEmitter {
  constructor () {
    super()
    this.readable = true
    this.writable = true
  }

  connect () { this.emit('connect') }
  reply (data) { this.emit('data', data) }
  write () {}
}

module.exports = net
