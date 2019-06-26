const net = require('net')

/** Represents a connection to a Fist server. */
class FistConnection {
  /**
   * Create a new connection to a Fist server.
   *
   * @param {string} host - The hostname of the Fist server
   * @param {number} port - The port of the Fist server
   */
  constructor (host = 'localhost', port = 5575) {
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

  /**
   * Add a document to the index.
   *
   * @param {string} doc - The name of the document to be added
   * @param {string} data - The contents of the document to be added
   * @param {function} cb - A callback to be notified when the document is added
   */
  index (doc, data, cb) {
    this._socket.write(`INDEX ${doc} ${data}\r\n`, 'utf8', () => {
      this._callbacks.push(line => {
        const err = line === 'Text has been indexed' ? null : 'Invalid response'
        if (cb) return cb(err)
      })
    })
  }

  /**
   * Search for a document in the index.
   *
   * @param {string} data - A string to search the index for
   * @param {function} cb - A callback called with the results
   */
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
