const Sequelize = require('sequelize').Sequelize
const sequelize = require('../util/database')

const CartItem = sequelize.define('cartItem', {
  quantity: Sequelize.INTEGER
})

module.exports = CartItem
