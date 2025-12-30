console.log("reminders.js loaded")
const token = localStorage.getItem("token")

let currentPage = 1
let currentFilter = ''

window.onload = () => {
    loadReminders()
}

async function loadReminders() {
    try {
        const params = new URLSearchParams({
            page: currentPage,
            limit: 10
        })
        
        if (currentFilter) {
            params.append('status', currentFilter)
        }
        
        const response = await axios.get(`http://localhost:2000/reminder/get?${params}`, {
            headers: { token }
        })
        
        const { reminders, pagination } = response.data
        
        renderReminders(reminders)
        renderPagination(pagination)
        
    } catch (error) {
        console.log(error)
        alert("Error loading reminders")
    }
}

function renderReminders(reminders) {
    const container = document.getElementById("remindersList")
    container.innerHTML = ""
    
    if (reminders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6b7280;">
                <h3>No reminders found</h3>
                <p>Add reminders to stay on top of your job search</p>
            </div>
        `
        return
    }
    
    reminders.forEach(reminder => {
        const card = document.createElement("div")
        card.className = "application-card"
        
        const reminderDate = new Date(reminder.reminderDate)
        const isPast = reminderDate < new Date()
        const statusClass = reminder.status === 'completed' ? 'status-offer' : (isPast ? 'status-rejected' : 'status-applied')
        
        card.innerHTML = `
            <div class="app-header">
                <h3 class="job-title">${reminder.title}</h3>
                <span class="status-badge ${statusClass}">
                    ${reminder.status.charAt(0).toUpperCase() + reminder.status.slice(1)}
                </span>
            </div>
            <div class="app-details">
                <p><strong>Date:</strong> ${reminderDate.toLocaleString()}</p>
                ${reminder.description ? `<p><strong>Description:</strong> ${reminder.description}</p>` : ''}
            </div>
            <div class="app-actions">
                ${reminder.status === 'pending' ? `<button class="btn-action btn-view" onclick="markComplete(${reminder.id})">Mark Complete</button>` : ''}
                <button class="btn-action btn-delete" onclick="deleteReminder(${reminder.id})">Delete</button>
            </div>
        `
        container.appendChild(card)
    })
}

function renderPagination(pagination) {
    const container = document.getElementById("pagination")
    container.innerHTML = ""
    
    if (pagination.totalPages <= 1) return
    
    const { currentPage: page, totalPages } = pagination
    
    const prevBtn = document.createElement('button')
    prevBtn.className = 'pagination-btn'
    prevBtn.textContent = '« Previous'
    prevBtn.disabled = page === 1
    prevBtn.onclick = () => {
        if (page > 1) {
            currentPage = page - 1
            loadReminders()
        }
    }
    container.appendChild(prevBtn)
    
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
        const pageBtn = document.createElement('button')
        pageBtn.className = `pagination-btn ${i === page ? 'active' : ''}`
        pageBtn.textContent = i
        pageBtn.onclick = () => {
            currentPage = i
            loadReminders()
        }
        container.appendChild(pageBtn)
    }
    
    const nextBtn = document.createElement('button')
    nextBtn.className = 'pagination-btn'
    nextBtn.textContent = 'Next »'
    nextBtn.disabled = page === totalPages
    nextBtn.onclick = () => {
        if (page < totalPages) {
            currentPage = page + 1
            loadReminders()
        }
    }
    container.appendChild(nextBtn)
}

function filterReminders() {
    currentFilter = document.getElementById("statusFilter").value
    currentPage = 1
    loadReminders()
}

async function markComplete(id) {
    try {
        await axios.put(
            `http://localhost:2000/reminder/update/${id}`,
            { status: 'completed' },
            { headers: { token } }
        )
        loadReminders()
    } catch (error) {
        console.log(error)
        alert("Error updating reminder")
    }
}

async function deleteReminder(id) {
    if (!confirm('Are you sure you want to delete this reminder?')) {
        return
    }
    
    try {
        const response = await axios.delete(`http://localhost:2000/reminder/delete/${id}`, {
            headers: { token }
        })
        
        alert(response.data.msg)
        loadReminders()
    } catch (error) {
        console.log(error)
        alert("Error deleting reminder")
    }
}

function logout() {
    localStorage.removeItem("token")
    window.location.href = "/login"
}