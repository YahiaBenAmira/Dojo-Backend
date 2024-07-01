const {DataTypes} = require('sequelize')
const sequelize = require('../db/db')

const Company = sequelize.define('Company',{
    company_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    company_name: { 
       type:  DataTypes.STRING,
       allowNull: false,
    },
    imageType: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imageData: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
})
module.exports = Company