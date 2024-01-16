const sinon = require('sinon')

const User = require('../models/user')
const AuthController = require('../controllers/auth')

describe('Auth Controller', () => {
  it('should throw an error with code 500 if accessing the database fails', async (done) => {
    const expect = await require('chai').expect

    sinon.stub(User, 'findOne')
    User.findOne.throws()

    expect(AuthController.login).to.throw('500')

    User.findOne.restore()
    done()
  })
})
