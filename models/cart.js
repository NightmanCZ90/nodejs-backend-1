const Sequelize = require('sequelize').Sequelize
const sequelize = require('../util/database')

const Cart = sequelize.define('cart', {
  userId: {
    type: Sequelize.INTEGER,
    unique: true
  }
})

module.exports = Cart
