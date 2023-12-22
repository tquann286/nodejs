const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = 'mongodb+srv://quantrung286:Trungquan2806@cluster0.uknlqmo.mongodb.net/shop?retryWrites=true&w=majority'

let _db

const mongoConnect = (callback) => {
  MongoClient.connect(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })
    .then((client) => {
      console.log('Connected!')
      _db = client.db()
      callback()
    })
    .catch((err) => {
      console.log(err)
    })
}

const getDb = () => {
  if (_db) {
    return _db
  }

  throw 'No database found!'
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb
