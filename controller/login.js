const user = require("../model/user")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
async function Login_check(req, res){
    const {Mail_Phone, password} = req.body
    
    try {
        // Find user by phone OR email
        const phone_check = await user.findOne({where: {user_Phone: Mail_Phone}})
        const email_check = await user.findOne({where: {email: Mail_Phone}})
        
        // Get whichever exists
        const user_found = phone_check || email_check
        
        // If no user found
        if (!user_found) {
            return res.status(400).send({msg: "User not found"})
        }
        
        // Compare passwords - ADD AWAIT!
        const isMatch = await bcrypt.compare(password, user_found.password)
                
        if (!isMatch) { 
            return res.status(400).send({msg: "Wrong password"})
        }
        const token = jwt.sign({id:user_found.id,},"MYSECRETKEY")


        res.status(200).send({msg: "Success",token})
        
    } catch (error) {
        console.log("Login error:", error)
        res.status(500).send({msg: "Server error"})
    }
}

module.exports = {Login_check}