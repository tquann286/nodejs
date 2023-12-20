const fs = require('fs')
const path = require('path')

const dirName = require('../util/path')
const p = path.join(dirName, 'data', 'cart.json')

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, 'utf-8', (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 }
      if (!err && fileContent !== '') {
        cart = JSON.parse(fileContent)
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex((prod) => prod.id === id)
      const existingProduct = cart.products[existingProductIndex]
      let updatedProduct
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct }
        updatedProduct.qty = updatedProduct.qty + 1
        cart.products = [...cart.products]
        cart.products[existingProductIndex] = updatedProduct
      } else {
        updatedProduct = { id: id, qty: 1 }
        cart.products = [...cart.products, updatedProduct]
      }
      cart.totalPrice = cart.totalPrice + +productPrice
      fs.writeFile(p, JSON.stringify(cart), (err) => {
        if (err) {
          console.log('err: ', err)
        }
      })
    })
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fileContent) => {
      if (err) {
        return
      }
      const updatedCart = { ...JSON.parse(fileContent) }
      const product = updatedCart.products.find((prod) => prod.id === id)
      if (!product) {
        return
      }
      const productQty = product.qty
      updatedCart.products = updatedCart.products.filter((prod) => prod.id !== id)
      updatedCart.totalPrice = updatedCart.totalPrice - productPrice * productQty

      fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
        if (err) {
          console.log('err: ', err)
        }
      })
    })
  }

  static getCart(cb) {
    fs.readFile(p, 'utf-8', (err, fileContent) => {
      const cart = JSON.parse(fileContent)
      if (err) {
        cb(null)
      } else {
        cb(cart)
      }
    })
  }

  static getProducts(cb) {
    fs.readFile(p, 'utf-8', (err, fileContent) => {
      const cart = JSON.parse(fileContent)
      if (err) {
        cb(null)
      } else {
        cb(cart)
      }
    })
  }
}
