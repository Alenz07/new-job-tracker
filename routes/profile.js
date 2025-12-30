const express = require("express")
const router = express.Router()
const profile = require("../controller/profile")
const multer = require("multer")
const path = require("path")

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, 'resume-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const allowedTypes = /pdf|doc|docx/
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = allowedTypes.test(file.mimetype)
        
        if (mimetype && extname) {
            return cb(null, true)
        } else {
            cb(new Error('Only PDF and DOC files are allowed!'))
        }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
})

router.get("/fill", profile.checkData)
router.post("/update", upload.single('resume'), profile.upProfile)

module.exports = router