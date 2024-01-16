const { describe } = require('mocha')
const authMiddleware = require('../middleware/is-auth')

describe('Auth middleware', () => {
  it('should throw an error if no authorization header is present', async () => {
    const { expect } = await import('chai')
    const req = {
      get: () => null,
    }
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw('Not authenticated.')
  })

  it('should throw an error if the authorization header is only one string', async () => {
    const { expect } = await import('chai')
    const req = {
      get: () => 'xyz',
    }
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw()
  })

  it('should yield a userId after decoding the token', async () => {
    const { expect } = await import('chai')
    const req = {
      get: () => 'Bearer zxc',
    }

    authMiddleware(req, {}, () => {})
    expect(req).to.have.property('userId')
  })
})
