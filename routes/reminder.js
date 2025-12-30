const express = require("express")
const router = express.Router()
const reminder = require("../controller/reminder")

router.post("/add", reminder.addReminder)
router.get("/get", reminder.getReminders)
router.put("/update/:id", reminder.updateReminder)
router.delete("/delete/:id", reminder.deleteReminder)

module.exports = router