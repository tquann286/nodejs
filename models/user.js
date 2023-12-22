const { ObjectId } = require('mongodb')
const { getDb } = require('../util/database')

class User {
  constructor(username, email) {
    this.name = username
    this.email = email
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
    return db
      .collection('users')
      .findOne({ _id: new ObjectId(prodId) })
  }
}

module.exports = User
