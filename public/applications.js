console.log("applications is working")
const token = localStorage.getItem("token")
const editId = localStorage.getItem('editApplicationId')

window.onload = () => {
    if (editId) {
        // Load existing application data
        loadApplicationData(editId)
        // Change form title
        document.querySelector('h1').textContent = 'Edit Job Application'
        // Change submit button text
        document.querySelector('button[type="submit"]').textContent = 'Update Application'
    }
}

async function loadApplicationData(id) {
    try {
        const response = await axios.get(`http://localhost:2000/addJob/get/${id}`, {
            headers: { token }
        })
        
        const data = response.data
        
        // Pre-fill form
        document.getElementById("companyName").value = data.companyName
        document.getElementById("jobTitle").value = data.jobTitle
        document.getElementById("appDate").value = data.appdate.split('T')[0] // Format date
        document.getElementById("status").value = data.status
        document.getElementById("notes").value = data.notes || ''
        
    } catch (error) {
        console.log(error)
        alert("Error loading application data")
        // Clear the edit ID and redirect back
        localStorage.removeItem('editApplicationId')
        window.location.href = '/jobTracker'
    }
}

async function addJobApplication(event) {
    event.preventDefault()
    
    const data = {
        companyName: document.getElementById("companyName").value,
        jobTitle: document.getElementById("jobTitle").value,
        appdate: document.getElementById("appDate").value,
        status: document.getElementById("status").value,
        notes: document.getElementById("notes").value
    }

    try {
        if (editId) {
            // Update existing application
            const response = await axios.put(
                `http://localhost:2000/addJob/update/${editId}`,
                data,
                { headers: { token } }
            )
            alert(response.data.msg)
            localStorage.removeItem('editApplicationId')
        } else {
            // Create new application
            const response = await axios.post(
                "http://localhost:2000/addJob/new",
                data,
                { headers: { token } }
            )
            alert(response.data.msg)
        }
        
        // Clear form
        document.getElementById("applicationForm").reset()
        
        // Redirect back to job tracker
        window.location.href = '/jobTracker'
        
    } catch (error) {
        console.log(error)
        alert("Error saving application")
    }
}