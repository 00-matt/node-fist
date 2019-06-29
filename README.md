# node-fist
> Node.js client library for [Fist](https://github.com/f-prime/fist) full text search

### Installation

```
npm install node-fist
```

### Support and Requirements

Only the LTS and Current Node.js versions are supported.
Other versions may work, but are not actively tested.

### Usage

##### Connecting

```js
const { FistConnection } = require('node-fist')

const index = new FistConnection('localhost', 5575)
```

##### Indexing

```js
index.index('doc_1', 'the quick brown fox jumped over the lazy dog')
```

##### Searching

```js
index.search('lazy dog', (err, documents) => {
  if (err) return console.error(err)
  console.log(documents) // => ['doc_1']
})
```

##### Disconnecting

```js
index.close()
```

### License

Released under the terms of the MIT license.
See [LICENSE](LICENSE) for more details.
