# node-fist
> Node.js client library for [Fist](https://github.com/f-prime/fist) full text search

### Installation

```
npm install node-fist
```

### Usage

##### Connecting

```js
const { FistConnection } = require('node-fist')

const index = new FistConnection('localhost', 5575)
```

##### Indexing

```js
index.add('doc_1', 'the quick brown fox jumped over the lazy dog')
```

##### Searching

```js
index.search('lazy dog', (err, documents) => {
  if (err) return console.error(err)
  console.log(documents) // => ['doc_1']
})
```

### License

Released under the terms of the MIT license.
See [LICENSE](LICENSE) for more details.
