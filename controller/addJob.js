const applications = require("../model/applications")
const jwt = require("jsonwebtoken")

async function addApp(req, res) {
    const { companyName, appdate, jobTitle, status, notes } = req.body
    const { token } = req.headers
    const decoded = jwt.verify(token, "MYSECRETKEY")
    try {
        const adding = await applications.create({
            companyName: companyName,
            jobTitle: jobTitle,
            appdate: appdate,
            status: status,
            notes: notes,
            userDatumId: decoded.id
        })
        res.status(200).send({ msg: "Job Application added" })
    } catch (error) {
        res.status(400).send({ msg: "some problem happened" })
    }
}

async function getApp(req, res) {
    const { token } = req.headers
    const decoded = jwt.verify(token, "MYSECRETKEY")
    
    // Extract query parameters for filtering, sorting, and pagination
    const { status, sortBy = 'createdAt', order = 'DESC', page = 1, limit = 10, search } = req.query
    
    try {
        // Build where clause
        const whereClause = { userDatumId: decoded.id }
        
        if (status) {
            whereClause.status = status
        }
        
        if (search) {
            const { Op } = require('sequelize')
            whereClause[Op.or] = [
                { jobTitle: { [Op.like]: `%${search}%` } },
                { companyName: { [Op.like]: `%${search}%` } }
            ]
        }
        
        // Calculate offset for pagination
        const offset = (page - 1) * limit
        
        // Get total count for pagination
        const totalCount = await applications.count({ where: whereClause })
        
        // Get applications with filters, sorting, and pagination
        const getting = await applications.findAll({
            where: whereClause,
            order: [[sortBy, order]],
            limit: parseInt(limit),
            offset: parseInt(offset)
        })
        
        res.send({
            applications: getting,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: parseInt(limit)
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({ msg: "Error fetching applications" })
    }
}

async function getAppById(req, res) {
    const { id } = req.params
    const { token } = req.headers
    const decoded = jwt.verify(token, "MYSECRETKEY")
    
    try {
        const application = await applications.findOne({
            where: {
                id: id,
                userDatumId: decoded.id
            }
        })
        
        if (!application) {
            return res.status(404).send({ msg: "Application not found" })
        }
        
        res.status(200).send(application)
    } catch (error) {
        res.status(400).send({ msg: "Error fetching application" })
    }
}

async function updateApp(req, res) {
    const { id } = req.params
    const { companyName, appdate, jobTitle, status, notes } = req.body
    const { token } = req.headers
    const decoded = jwt.verify(token, "MYSECRETKEY")
    
    try {
        const application = await applications.findOne({
            where: {
                id: id,
                userDatumId: decoded.id
            }
        })
        
        if (!application) {
            return res.status(404).send({ msg: "Application not found" })
        }
        
        await applications.update(
            {
                companyName: companyName,
                jobTitle: jobTitle,
                appdate: appdate,
                status: status,
                notes: notes
            },
            {
                where: {
                    id: id,
                    userDatumId: decoded.id
                }
            }
        )
        
        res.status(200).send({ msg: "Application updated successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Error updating application" })
    }
}

async function deleteApp(req, res) {
    const { id } = req.params
    const { token } = req.headers
    const decoded = jwt.verify(token, "MYSECRETKEY")
    
    try {
        const deleted = await applications.destroy({
            where: {
                id: id,
                userDatumId: decoded.id
            }
        })
        
        if (deleted === 0) {
            return res.status(404).send({ msg: "Application not found" })
        }
        
        res.status(200).send({ msg: "Application deleted successfully" })
    } catch (error) {
        res.status(400).send({ msg: "Error deleting application" })
    }
}

module.exports = { addApp, getApp, getAppById, updateApp, deleteApp }