const reminder = require("../model/reminder")
const jwt = require("jsonwebtoken")
const { Op } = require("sequelize")

async function addReminder(req, res) {
    const { title, description, reminderDate, applicationId } = req.body
    const { token } = req.headers
    const decoded = jwt.verify(token, "MYSECRETKEY")
    
    try {
        const newReminder = await reminder.create({
            title,
            description,
            reminderDate,
            applicationId: applicationId || null,
            userDatumId: decoded.id
        })
        res.status(200).send({ msg: "Reminder added successfully" })
    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "Error adding reminder" })
    }
}

async function getReminders(req, res) {
    const { token } = req.headers
    const decoded = jwt.verify(token, "MYSECRETKEY")
    const { status, page = 1, limit = 10 } = req.query
    
    try {
        const whereClause = { userDatumId: decoded.id }
        
        if (status) {
            whereClause.status = status
        }
        
        const offset = (page - 1) * limit
        const totalCount = await reminder.count({ where: whereClause })
        
        const reminders = await reminder.findAll({
            where: whereClause,
            order: [['reminderDate', 'ASC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        })
        
        res.status(200).send({
            reminders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "Error fetching reminders" })
    }
}

async function updateReminder(req, res) {
    const { id } = req.params
    const { title, description, reminderDate, status } = req.body
    const { token } = req.headers
    const decoded = jwt.verify(token, "MYSECRETKEY")
    
    try {
        await reminder.update(
            { title, description, reminderDate, status },
            { where: { id, userDatumId: decoded.id } }
        )
        res.status(200).send({ msg: "Reminder updated successfully" })
    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "Error updating reminder" })
    }
}

async function deleteReminder(req, res) {
    const { id } = req.params
    const { token } = req.headers
    const decoded = jwt.verify(token, "MYSECRETKEY")
    
    try {
        const deleted = await reminder.destroy({
            where: { id, userDatumId: decoded.id }
        })
        
        if (deleted === 0) {
            return res.status(404).send({ msg: "Reminder not found" })
        }
        
        res.status(200).send({ msg: "Reminder deleted successfully" })
    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "Error deleting reminder" })
    }
}

module.exports = { addReminder, getReminders, updateReminder, deleteReminder }