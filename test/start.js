const { it } = require('mocha')

it('should add numbers correctly', async () => {
  const { expect } = await import('chai')

  const num1 = 2
  const num2 = 3

  expect(num1 + num2).to.equal(5)
})
