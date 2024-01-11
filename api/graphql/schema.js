const { buildSchema } = require('graphql')

module.exports = buildSchema(`
  type TestData {
    text: String!
    views: Int!
  }

  type RootQuery {
    hello: TestData
  }

  type RootMutation {
    hello: TestData
  }

  schema {
    query: RootQuery
    mutation: RootMutation
  }
`)
