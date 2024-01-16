const sinon = require('sinon')
const mongoose = require('mongoose')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

describe('Auth Controller', () => {
  // it('should throw an error with code 500 if accessing the database fails', async (done) => {
  //   const { expect } = await require('chai')

  //   sinon.stub(User, 'findOne')
  //   User.findOne.throws()

  //   const req = {
  //     body: {
  //       email: 'test@test.com',
  //       password: 'tester',
  //     },
  //   }

  //   AuthController.login(req, {}, () => {}).then((result) => {
  //     console.log('result: ', result)
  //     expect(result).to.be.an('error')
  //     expect(result).to.have.property('statusCode', 500)
  //     done()
  //   }).catch((err) => {
  //     done(err)
  //   })

  //   User.findOne.restore()
  // })

  it('should send a response with a valid user status for an existing user', async (done) => {
    const { expect } = await require('chai')

    mongoose
      .connect('mongodb+srv://quantrung286:Trungquan2806@cluster0.uknlqmo.mongodb.net/test-messages?retryWrites=true&w=majority')
      .then(() => {
        const user = new User({
          email: 'test@test.com',
          password: 'tester',
          name: 'Test',
          posts: [],
        })
      })
      .catch((err) => console.log(err))
  })
})
