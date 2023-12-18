const fs = require('fs')
const path = require('path')

module.exports = class Product {
  constructor(t) {
    this.title = t
  }

  save() {
    const p = path.join(path.dirname(require.main.filename), 'data', 'products.json')
    fs.readFile(p, 'utf-8', (err, fileContent) => {
      let products = []
      if (!err && fileContent != '') {
        products = JSON.parse(fileContent)
      }
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log('err: ', err)
        }
      })
    })
  }

  static fetchAll(cb) {
    const p = path.join(path.dirname(require.main.filename), 'data', 'products.json')
    fs.readFile(p, 'utf-8', (err, fileContent) => {
      if (err || fileContent === '') {
        cb([])
      }
      cb(JSON.parse(fileContent))
    })
  }
}
