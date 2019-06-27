const EventEmitter = require('events')
const stream = require('stream')
const util = require('util')

const net = jest.genMockFromModule('net')

net.Socket = class extends EventEmitter {
  constructor () {
    super()
    this.destroyed = false
    this.readable = true
    this.writable = true
  }

  end (cb) {
    this.destroyed = true
    this.readable = false
    this.writable = false
    cb()
  }
  connect () { this.emit('connect') }
  reply (data) { this.readable && this.emit('data', data) }
  write () {}
}

module.exports = net
