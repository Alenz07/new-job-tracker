const profile = require("../model/profile")
const user = require("../model/user")
const db = require("../utils/db")
const jwt = require("jsonwebtoken")
async function checkData(req,res) {
    const{token} = req.headers
    const decoded = jwt.verify(token,"MYSECRETKEY")
    const id = decoded.id
    const findInfo = await user.findOne({where:{
        id:id
    }})
    if(findInfo==null){
        res.status(400).send("error came")
    }
    try {
        const findData = await profile.findOne({where:{
            userDatumId: id
        }})
        if(findData==null){
            return res.status(200).send({data:{name:findInfo.user_Name,email:findInfo.email}})
        }
        else{
            return res.status(200).send({data:{name:findInfo.user_Name,email:findInfo.email},dataInfo:{education:findData.education,skills:findData.skills,experience:findData.experience}})
        }
    } catch (error) {
        console.log(error)
    }


}

async function upProfile(req,res){
    const{token} = req.headers
    const decoded = jwt.verify(token,"MYSECRETKEY")
    const id = decoded.id
    const{name,skills,education,experience} = req.body
    try {
            const upate_name = await user.update({user_Name:name}, {where:{id:id}})
            const finding_user = await profile.findOne({where:{userDatumId:id}})
            if(finding_user==null){
                const profileCreate = await profile.create({education:education,skills:skills,experience:experience,userDatumId:id})
            }
            else{
            const profileUpdate  = await profile.update({education:education,skills:skills,experience:experience},{where:{userDatumId:id}})
            }
            res.status(200).send({msg:"Information Updated"})
    } catch (error) {
        res.status(400).send({msg:"Some error occured"})
    }
}

module.exports  = {checkData,upProfile}