const db = require("../utils/db")
const{DataTypes} = require("sequelize")
const user = db.define("userData",{
    
    user_Name:{
        type: DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    password:{
        type:DataTypes.STRING
    },
    user_Phone:{
        type:DataTypes.INTEGER
    }

})
module.exports  = user