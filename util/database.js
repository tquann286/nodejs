const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = 'mongodb+srv://quantrung286:Trungquan2806@cluster0.uknlqmo.mongodb.net/shop?retryWrites=true&w=majority'

let _db

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
const mongoConnect = (cb) => {
  client
    .connect()
    .then((result) => {
      _db = result.db()
      cb()
    })
    .catch((err) => {
      console.log(err)
      throw err
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
