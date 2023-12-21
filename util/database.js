const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
  host: '127.0.0.1',
  port: '3307',
  username: 'root',
  database: 'node-complete',
  password: 'Trungquan2806',
  dialect: 'mysql'
})

module.exports = sequelize
