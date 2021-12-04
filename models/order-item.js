const Sequelize = require('sequelize').Sequelize
const sequelize = require('../util/database')

const OrderItem = sequelize.define('orderItem', {
  quantity: Sequelize.INTEGER
})

module.exports = OrderItem
