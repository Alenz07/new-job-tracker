const db = require("../utils/db")
const {DataTypes} = require("sequelize")

const reminder = db.define("reminders", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    reminderDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed'),
        defaultValue: 'pending'
    },
    applicationId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

module.exports = reminder