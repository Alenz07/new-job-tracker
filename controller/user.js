const { Sequelize } = require("sequelize")
const user = require("../model/user")
const bcrypt = require("bcrypt")

async function signup(req,res){
    try {
        console.log("yes working")
        const{name_user,phone_no,email,password} = req.body
        const ifAlreadyExist = await user.findOne({where:{
            email:email
        }})
        if(ifAlreadyExist != null){
           res.status(500).send({msg:"User Already Exists"})
           return
        }
        const new_pass = await bcrypt.hash(password,6)
        const adding_user = await user.create({
            user_Name:name_user,user_Phone:phone_no,email:email,password:new_pass
        })
         res.status(200).send({msg:"User added successfully"})

    } catch (error) {
       console.log(error)
       res.status(400).send(`some error occured ${error}`) 
    }
}
module.exports = {signup}