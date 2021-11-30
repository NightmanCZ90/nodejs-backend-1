const Sequelize = require('sequelize').Sequelize

// add password
const sequelize = new Sequelize('node-complete', 'root', '', { dialect: 'mysql', host: 'localhost' })

module.exports = sequelize