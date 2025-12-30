const express = require("express")
const router = express.Router()
const company = require("../controller/company")

router.post("/add", company.addCompany)
router.get("/get", company.getCompanies)
router.get("/get/:id", company.getCompanyById)
router.put("/update/:id", company.updateCompany)
router.delete("/delete/:id", company.deleteCompany)

module.exports = router