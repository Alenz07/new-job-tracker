
const {Sequelize} = require("sequelize")
const db = new Sequelize("jobtrack", "root", "database",{
    host: 'localhost',
    dialect: 'mysql',
    port: 3300
  }
);

(async()=>{
    try {
        const db_check = await db.authenticate()
        console.log("it is working")
         
    } catch (error) {
        console.log(error)
    } 
})()
module.exports =db