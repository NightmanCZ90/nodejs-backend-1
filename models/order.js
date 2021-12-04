const Sequelize = require('sequelize').Sequelize
const sequelize = require('../util/database')

const Order = sequelize.define('order')

module.exports = Order
