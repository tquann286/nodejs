const getDb = require('../util/database').getDb
const ObjectId = require('mongodb').ObjectId

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
  }

  save() {
    const db = getDb()
    return db
      .collection('products')
      .insertOne(this)
      .catch((err) => {
        console.log(err)
      })
  }

  static fetchAll() {
    const db = getDb()
    return db
      .collection('products')
      .find()
      .toArray()
      .catch((err) => console.log(err))
  }

  static findById(prodId) {
    const db = getDb()
    return db.collection('products').find({ _id: new ObjectId(prodId) }).next()
  }
}

module.exports = Product
