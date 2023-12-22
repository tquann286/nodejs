const getDb = require('../util/database').getDb
const ObjectId = require('mongodb').ObjectId

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title
    this.price = price
    this.description = description
    this.imageUrl = imageUrl
    this._id = id ? new ObjectId(id) : null
  }

  save() {
    const db = getDb()
    let dbOp
    if (this._id) {
      dbOp = db.collection('products').updateOne({ _id: this._id }, { $set: this })
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

  static deleteById(prodId) {
    const db = getDb()
    return db.collection('products').deleteOne({ _id: new ObjectId(prodId) })
  }
}

module.exports = Product
