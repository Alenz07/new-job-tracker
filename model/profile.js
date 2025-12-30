const db = require("../utils/db")
const {DataTypes} = require("sequelize")

const profile = db.define("userProfile", {
    education: {
        type: DataTypes.STRING
    },
    skills: {
        type: DataTypes.STRING
    },
    experience: {
        type: DataTypes.STRING
    },
    resumePath: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    underscored: false
})

module.exports = profile