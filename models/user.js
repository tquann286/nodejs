const { ObjectId } = require('mongodb')
const { getDb } = require('../util/database')

class User {
  constructor(username, email, cart, id) {
    this.name = username
    this.email = email
    this.cart = cart
    this._id = id
  }

  save() {
    const db = getDb()

    return db
      .collection('users')
      .insertOne(this)
      .catch((err) => console.log(err))
  }

  static findById(prodId) {
    const db = getDb()
    return db.collection('users').findOne({ _id: new ObjectId(prodId) })
  }

  addToCart(product) {
    const cartProductIndex = this.cart?.items?.findIndex((cp) => cp.productId.toString() === product._id.toString())
    let newQuantity = 1
    const updatedCartItems = [...(this.cart?.items || [])]

    if (cartProductIndex >= 0) {
      newQuantity += this.cart.items[cartProductIndex].quantity
      updatedCartItems[cartProductIndex].quantity = newQuantity
    } else {
      updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity })
    }
    const updatedCart = {
      items: updatedCartItems,
    }
    const db = getDb()
    return db.collection('users').updateOne({ _id: new ObjectId(this._id) }, { $set: { cart: updatedCart } })
  }
}

module.exports = User
