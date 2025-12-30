const db = require("../utils/db")
const {DataTypes} = require("sequelize")

const applications = db.define("applications",{
    
    companyName:{
        type: DataTypes.STRING,
        allowNull:false
    },
    jobTitle:{
        type:DataTypes.STRING
        ,allowNull:false
    },
    appdate:{
        type:DataTypes.DATE,
        allowNull:false

    },
    status:{
        type:DataTypes.STRING,
        allowNull:false

    },
    notes:{
        type:DataTypes.STRING
    }

})

module.exports  = applications