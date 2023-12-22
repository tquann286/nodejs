const { MongoClient, ServerApiVersion } = require('mongodb')
const uri = 'mongodb+srv://quantrung286:Trungquan2806@cluster0.uknlqmo.mongodb.net/?retryWrites=true&w=majority'

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
      cb(result)
    })
    .catch((err) => console.log(err))
}

module.exports = mongoConnect
