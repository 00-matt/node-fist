const net = require('net')

class FistConnection {
  constructor (host = localhost, port = 5575) {
    this._incomplete = ''
    this._callbacks = []
    this._socket = new net.Socket()
    this._socket.connect(port, host)
    this._socket.once('connect', () => {
      this._socket.setNoDelay()
    })
    this._socket.on('data', data => {
      this._incomplete += data
      if (this._incomplete.indexOf('\n') !== -1) {
        const lines = this._incomplete.split('\n')
        this._incomplete = this._incomplete.slice(-1) === '\n' ? '' :
          lines.pop()
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim()
          if (this._callbacks.length === 0) break;
          this._callbacks.shift()(line)
        }
      }
    })
  }

  index (doc, data, cb) {
    this._socket.write(`INDEX ${doc} ${data}\r\n`, 'utf8', () => {
      this._callbacks.push(line => {
        const err = line === 'Text has been indexed' ? null : 'Invalid response'
        if (cb) return cb(err)
      })
    })
  }

  search (data, cb) {
    this._socket.write(`SEARCH ${data}\r\n`, 'utf8', () => {
      this._callbacks.push(line => {
        try {
          const documents = JSON.parse(line)
          return cb(null, documents)
        } catch (e) {
          return cb(e)
        }
      })
    })
  }
}

module.exports = { FistConnection }
