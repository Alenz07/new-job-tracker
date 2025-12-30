const Company = require("../model/company");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

async function addCompany(req, res) {
    const { token } = req.headers;
    
    try {
        const decoded = jwt.verify(token, "MYSECRETKEY");
        const userId = decoded.id;
        
        const { companyName, location, industry, avgPackage, notes } = req.body;
        
        // Check if company already exists for this user
        const existingCompany = await Company.findOne({
            where: {
                companyName: companyName,
                userDatumId: userId
            }
        });
        
        if (existingCompany) {
            return res.status(400).send({ msg: "Company already exists in your list" });
        }
        
        const newCompany = await Company.create({
            companyName: companyName,
            location: location,
            industry: industry,
            avgPackage: avgPackage,
            notes: notes,
            userDatumId: userId
        });
        
        res.status(200).send({ msg: "Company information added successfully", company: newCompany });
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: "Error adding company information" });
    }
}

async function getCompanies(req, res) {
    const { token } = req.headers;
    const decoded = jwt.verify(token, "MYSECRETKEY");
    const { search, industry, page = 1, limit = 10 } = req.query;
    
    try {
        const whereClause = { userDatumId: decoded.id };
        
        if (search) {
            whereClause[Op.or] = [
                { companyName: { [Op.like]: `%${search}%` } },
                { location: { [Op.like]: `%${search}%` } }
            ];
        }
        
        if (industry) {
            whereClause.industry = industry;
        }
        
        const offset = (page - 1) * limit;
        const totalCount = await Company.count({ where: whereClause });
        
        const companies = await Company.findAll({
            where: whereClause,
            order: [['createdAt', 'DESC']],
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
        
        res.status(200).send({
            companies,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount,
                itemsPerPage: parseInt(limit)
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: "Error fetching companies" });
    }
}

async function getCompanyById(req, res) {
    const { id } = req.params;
    const { token } = req.headers;
    const decoded = jwt.verify(token, "MYSECRETKEY");
    
    try {
        const company = await Company.findOne({
            where: {
                id: id,
                userDatumId: decoded.id
            }
        });
        
        if (!company) {
            return res.status(404).send({ msg: "Company not found" });
        }
        
        res.status(200).send(company);
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: "Error fetching company" });
    }
}

async function updateCompany(req, res) {
    const { id } = req.params;
    const { companyName, location, industry, avgPackage, notes } = req.body;
    const { token } = req.headers;
    const decoded = jwt.verify(token, "MYSECRETKEY");
    
    try {
        const company = await Company.findOne({
            where: { id, userDatumId: decoded.id }
        });
        
        if (!company) {
            return res.status(404).send({ msg: "Company not found" });
        }
        
        await Company.update(
            { companyName, location, industry, avgPackage, notes },
            { where: { id, userDatumId: decoded.id } }
        );
        
        res.status(200).send({ msg: "Company updated successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: "Error updating company" });
    }
}

async function deleteCompany(req, res) {
    const { id } = req.params;
    const { token } = req.headers;
    const decoded = jwt.verify(token, "MYSECRETKEY");
    
    try {
        const deleted = await Company.destroy({
            where: { id, userDatumId: decoded.id }
        });
        
        if (deleted === 0) {
            return res.status(404).send({ msg: "Company not found" });
        }
        
        res.status(200).send({ msg: "Company deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: "Error deleting company" });
    }
}

module.exports = { 
    addCompany, 
    getCompanies, 
    getCompanyById, 
    updateCompany, 
    deleteCompany 
};