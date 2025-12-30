const express = require("express")
const app = express()
const mysql = require("mysql2")
const user = require("./routes/user")
const login = require("./routes/login")
const addJob = require("./routes/addJob")
const profile = require("./routes/profile")
const company = require("./routes/company")
const reminder = require("./routes/reminder")
const db = require("./utils/db")
const path = require("path")
const { startReminderScheduler } = require("./utils/reminderScheduler")

const models = require("./model/index")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("./public"))

// Routes
app.use("/signup",user)
app.use("/log",login)
app.use("/addJob",addJob)
app.use("/profile", profile)
app.use("/company", company)
app.use("/reminder", reminder)

// Pages
app.get("/",(req,res)=>{
    console.log("this is working")
    res.sendFile(path.join(__dirname, "views", "signup.html"))
})
app.get("/login",(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "login.html"))
})
app.get("/companies",(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "companies.html"))
})
app.get("/jobTracker",(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "jobTrack.html"))
})
app.get("/addCompany",(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "addCompany.html"))
})
app.get("/addJob",(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "addJob.html"))
})
app.get("/userProfile",(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "profile.html"))
})
app.get("/reminders",(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "reminders.html"))
})
app.get("/addReminder",(req,res)=>{
    res.sendFile(path.join(__dirname, "views", "addReminder.html"))
})

db.sync({force:false}).then(() => {
    // Start reminder scheduler after DB is ready
    startReminderScheduler()
})

app.listen(2000,()=>{
    console.log("server is running")
})