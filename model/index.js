const user = require("./user")
const applications = require("./applications")
const profile = require("./profile")
const company = require("./company")
const reminder = require("./reminder")
user.hasMany(applications)
applications.belongsTo(user)

user.hasOne(profile)
profile.belongsTo(user)

user.hasMany(company)
company.belongsTo(user)

user.hasMany(reminder)
reminder.belongsTo(user)

module.exports = {user,applications,profile,company,reminder}
