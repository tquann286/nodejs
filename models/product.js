const getDb = require('../util/database').getDb
const ObjectId = require('mongodb').ObjectId

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id
  }

  save() {
    const db = getDb()
    let dbOp
    const { _id, ...updatedProduct } = this
    if (this._id) {
      dbOp = db.collection('products').updateOne({ _id: new ObjectId(this._id) }, { $set: updatedProduct  })
    } else {
      dbOp = db.collection('products').insertOne(this)
    }

    return dbOp.catch((err) => {
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
    return db
      .collection('products')
      .find({ _id: new ObjectId(prodId) })
      .next()
  }
}

module.exports = Product
