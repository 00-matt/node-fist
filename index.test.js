jest.mock('net')

const { FistConnection } = require('./')

describe('FistConnection', () => {
  describe('index', () => {
    it('should successfuly index documents', done => {
      const index = new FistConnection()
      index._socket.write = jest.fn((chunk, encoding, cb) => {
        expect(chunk).toEqual('INDEX doc_a hello there\r\n')
        cb()
        index._socket.reply('Text has been indexed\n')
      })
      index.index('doc_a', 'hello there', err => {
        if (err) return done(err)
        expect(index._socket.write.mock.calls.length).toEqual(1)
        done()
      })
    })
    it('should gracefully handles errors', done => {
      const index = new FistConnection()
      index._socket.write = jest.fn((chunk, encoding, cb) => {
        cb()
        index._socket.reply('Too few arguments\n')
      })
      index.index('doc_a', '', err => {
        expect(index._socket.write.mock.calls.length).toEqual(1)
        expect(err).toBeInstanceOf(Error)
        done()
      })
    })
  })
  describe('search', () => {
    it('should return all matches', done => {
      const index = new FistConnection()
      index._socket.write = jest.fn((chunk, encoding, cb) => {
        expect(chunk).toEqual('SEARCH hello\r\n')
        cb()
        index._socket.reply('["doc_a", "doc_f"]\n')
      })
      index.search('hello', (err, matches) => {
        if (err) return done(err)
        expect(index._socket.write.mock.calls.length).toEqual(1)
        expect(matches).toEqual(['doc_a', 'doc_f'])
        done()
      })
    })
    it('should allow for no matches', done => {
      const index = new FistConnection()
      index._socket.write = jest.fn((chunk, encoding, cb) => {
        expect(chunk).toEqual('SEARCH hello\r\n')
        cb()
        index._socket.reply('[]\n')
      })
      index.search('hello', (err, matches) => {
        if (err) return done(err)
        expect(index._socket.write.mock.calls.length).toEqual(1)
        expect(matches).toEqual([])
        done()
      })
    })
    it('should gracefully handle errors', done => {
      const index = new FistConnection()
      index._socket.write = jest.fn((chunk, encoding, cb) => {
        cb()
        index._socket.reply('Too few arguments\n')
      })
      index.search('', (err, matches) => {
        expect(index._socket.write.mock.calls.length).toEqual(1)
        expect(err).toBeInstanceOf(Error)
        done()
      })
    })
  })
})
