const cron = require('node-cron')
const reminder = require('../model/reminder')
const user = require('../model/user')
const { sendReminderEmail } = require('./emailService')
const { Op } = require('sequelize')

// Check for reminders every 5 minutes
function startReminderScheduler() {
    cron.schedule('*/5 * * * *', async () => {
        console.log('Checking for reminders...')
        
        try {
            const now = new Date()
            const fiveMinutesFromNow = new Date(now.getTime() + 5 * 60000)
            
            // Find reminders that are due within next 5 minutes and not sent yet
            const dueReminders = await reminder.findAll({
                where: {
                    reminderDate: {
                        [Op.between]: [now, fiveMinutesFromNow]
                    },
                    status: 'pending',
                    emailSent: false
                },
                include: [{
                    model: user,
                    attributes: ['email', 'user_Name']
                }]
            })
            
            // Send emails for each reminder
            for (const rem of dueReminders) {
                const emailSent = await sendReminderEmail(
                    rem.userDatum.email,
                    rem.userDatum.user_Name,
                    rem
                )
                
                if (emailSent) {
                    // Mark as email sent
                    await rem.update({ emailSent: true })
                }
            }
            
            if (dueReminders.length > 0) {
                console.log(`Processed ${dueReminders.length} reminders`)
            }
            
        } catch (error) {
            console.error('Error in reminder scheduler:', error)
        }
    })
    
    console.log('Reminder scheduler started - checking every 5 minutes')
}

module.exports = { startReminderScheduler }