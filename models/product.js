const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const Product = sequelize.define('product', {
  // removed from object, MYSQL will create it automaticaly
  // id: {
  //   type: Sequelize.INTEGER,
  //   autoIncrementing: true,
  //   allowNull: false,
  //   primaryKey: true,
  // },
  title: {
    type: Sequelize.STRING,
  },
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
})

module.exports = Product