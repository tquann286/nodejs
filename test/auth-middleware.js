const authMiddleware = require('../middleware/is-auth')

it('should throw an error if no authorization header is present', async () => {
  const { expect } = await import('chai')
  const req = {
    session: {
      isLoggedIn: false,
    },
  }
  expect(authMiddleware.bind(this, req, { redirect: () => {} }, () => {})).to.throw('Not authenticated.')
})
