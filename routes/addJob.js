const express = require("express")
const router = express.Router()
const addApp = require("../controller/addJob")

// Create new application
router.post("/new", addApp.addApp)

// Get all applications with filters, sort, pagination
router.get("/get", addApp.getApp)

// Get single application by ID
router.get("/get/:id", addApp.getAppById)

// Update application
router.put("/update/:id", addApp.updateApp)

// Delete application
router.delete("/delete/:id", addApp.deleteApp)

module.exports = router