const nodemailer = require('nodemailer')

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'mewzeno194@gmail.com', // Your Gmail
        pass: 'goousxyceajagsqu'     // Gmail App Password (not regular password)
    }
})

async function sendReminderEmail(userEmail, userName, reminder) {
    const mailOptions = {
        from: 'your-email@gmail.com',
        to: userEmail,
        subject: `Reminder: ${reminder.title}`,
        html: `
            <h2>Job Tracker Reminder</h2>
            <p>Hi ${userName},</p>
            <p>This is a reminder for:</p>
            <h3>${reminder.title}</h3>
            <p>${reminder.description || 'No description provided'}</p>
            <p><strong>Scheduled for:</strong> ${new Date(reminder.reminderDate).toLocaleString()}</p>
            <br>
            <p>Good luck with your job search!</p>
            <p>- JobTracker Team</p>
        `
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log(`Reminder email sent to ${userEmail}`)
        return true
    } catch (error) {
        console.error('Error sending email:', error)
        return false
    }
}

module.exports = { sendReminderEmail }