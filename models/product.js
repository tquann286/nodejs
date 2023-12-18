const fs = require('fs')
const path = require('path')

const dirName = require('../util/path')
const p = path.join(dirName, 'data', 'products.json')

const getProductsFromFile = (cb) => {
  fs.readFile(p, 'utf-8', (err, fileContent) => {
    if (err || fileContent === '') {
      cb([])
    }
    cb(JSON.parse(fileContent))
  })
}

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title
    this.imageUrl = imageUrl
    this.description = description
    this.price = price
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this)
      fs.writeFile(p, JSON.stringify(products), (err) => {
        if (err) {
          console.log('err: ', err)
        }
      })
    })
  }

  static fetchAll(cb) {
    getProductsFromFile(cb)
  }
}
