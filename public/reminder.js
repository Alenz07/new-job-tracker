console.log("reminder.js is working")
const token = localStorage.getItem("token")

async function addReminder(event) {
    event.preventDefault()
    
    const data = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        reminderDate: document.getElementById("reminderDate").value
    }

    try {
        const response = await axios.post(
            "http://localhost:2000/reminder/add",
            data,
            { headers: { token } }
        )
        alert(response.data.msg)
        document.getElementById("reminderForm").reset()
        window.location.href = '/reminders'
    } catch (error) {
        console.log(error)
        alert("Error adding reminder")
    }
}

function cancel() {
    window.location.href = '/reminders'
}