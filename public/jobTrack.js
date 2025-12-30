console.log("this is working")
const token = localStorage.getItem("token")

// State management for filters and pagination
let currentPage = 1
let currentFilters = {
    status: '',
    sortBy: 'createdAt',
    order: 'DESC',
    search: ''
}

window.onload = () => {
    getApplications()
    setupEventListeners()
}
function logout() {
    localStorage.removeItem("token")
    window.location.href = "/login"
}

function setupEventListeners() {
    // Search functionality
    const searchBtn = document.querySelector('.btn-search')
    const searchInput = document.querySelector('.search-input')
    
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            currentFilters.search = searchInput.value
            currentPage = 1
            getApplications()
        })
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                currentFilters.search = searchInput.value
                currentPage = 1
                getApplications()
            }
        })
    }
    
    // Status filter
    const statusFilter = document.querySelectorAll('.filter-select')[0]
    if (statusFilter) {
        statusFilter.addEventListener('change', (e) => {
            currentFilters.status = e.target.value
            currentPage = 1
            getApplications()
        })
    }
    
    // Sort functionality
    const sortFilter = document.querySelectorAll('.filter-select')[1]
    if (sortFilter) {
        sortFilter.addEventListener('change', (e) => {
            const value = e.target.value
            if (value === 'newest') {
                currentFilters.sortBy = 'createdAt'
                currentFilters.order = 'DESC'
            } else if (value === 'oldest') {
                currentFilters.sortBy = 'createdAt'
                currentFilters.order = 'ASC'
            }
            currentPage = 1
            getApplications()
        })
    }
}

async function getApplications() {
    try {
        // Build query string with current filters
        const params = new URLSearchParams({
            page: currentPage,
            limit: 4,
            sortBy: currentFilters.sortBy,
            order: currentFilters.order
        })
        
        if (currentFilters.status) {
            params.append('status', currentFilters.status)
        }
        
        if (currentFilters.search) {
            params.append('search', currentFilters.search)
        }
        
        // Get filtered/paginated applications
        const getData = await axios.get(`http://localhost:2000/addJob/get?${params}`, {
            headers: { token }
        })
        
        const { applications, pagination } = getData.data
        
        // PAGINATION FIX: If current page is empty and we're not on page 1, redirect to last valid page
        if (applications.length === 0 && currentPage > 1 && pagination.totalPages > 0) {
            currentPage = pagination.totalPages
            // Recursively call to load the correct page
            return getApplications()
        }
        
        // Get ALL applications for statistics (separate call without pagination)
        const allAppsResponse = await axios.get('http://localhost:2000/addJob/get?limit=1000', {
            headers: { token }
        })
        
        // Calculate statistics from all applications
        let applied = 0, interview = 0, rejected = 0, offers = 0
        
        allAppsResponse.data.applications.forEach(i => {
            if (i.status === "applied") applied += 1
            if (i.status === "interview") interview += 1
            if (i.status === "rejected") rejected += 1
            if (i.status === "offer") offers += 1
        })
        applied = interview + rejected + offers
        
        // Update statistics display
        document.getElementById("applied").textContent = applied
        document.getElementById("interview").textContent = interview
        document.getElementById("offer").textContent = offers
        document.getElementById("rejected").textContent = rejected
        document.getElementById("successRate").textContent = (offers/applied) * 100
        document.getElementById("responseRate").textContent = (interview+offers/applied)*100
        document.getElementById("pendingRate").textContent = (applied - (interview+offers)/applied) * 100
        
        // Render application cards
        renderApplications(applications)
        
        // Render pagination controls
        renderPagination(pagination)
        
    } catch (error) {
        console.log(error)
        alert("Error loading applications. Please try again.")
    }
}

function renderApplications(applications) {
    const container = document.querySelector(".applications-list")
    container.innerHTML = ""
    
    // Handle empty state
    if (applications.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6b7280;">
                <h3>No applications found</h3>
                <p>Try adjusting your filters or add a new application</p>
            </div>
        `
        return
    }
    
    // Render each application card
    applications.forEach(i => {
        const card = document.createElement("div")
        card.classList.add("application-card")
        card.innerHTML = `
            <div class="app-header">
                <h3 class="job-title">${i.jobTitle}</h3>
                <span class="status-badge status-${i.status}">
                    ${i.status.charAt(0).toUpperCase() + i.status.slice(1)}
                </span>
            </div>

            <div class="app-details">
                <p><strong>Company:</strong> ${i.companyName}</p>
                <p><strong>Applied Date:</strong> ${new Date(i.appdate).toLocaleDateString()}</p>
                ${i.notes ? `<p><strong>Notes:</strong> ${i.notes.substring(0, 100)}${i.notes.length > 100 ? '...' : ''}</p>` : ''}
            </div>

            <div class="app-actions">
                <button class="btn-action btn-edit" onclick="editApplication(${i.id})">Edit</button>
                <button class="btn-action btn-delete" onclick="deleteApplication(${i.id})">Delete</button>
            </div>
        `
        container.appendChild(card)
    })
}

function renderPagination(pagination) {
    const paginationContainer = document.querySelector('.pagination')
    paginationContainer.innerHTML = ''
    
    const { currentPage: page, totalPages } = pagination
    
    // Don't show pagination if only 1 page
    if (totalPages <= 1) {
        return
    }
    
    // Previous button
    const prevBtn = document.createElement('button')
    prevBtn.className = 'pagination-btn'
    prevBtn.textContent = '« Previous'
    prevBtn.disabled = page === 1
    prevBtn.style.opacity = page === 1 ? '0.5' : '1'
    prevBtn.style.cursor = page === 1 ? 'not-allowed' : 'pointer'
    prevBtn.onclick = () => {
        if (page > 1) {
            currentPage = page - 1
            getApplications()
        }
    }
    paginationContainer.appendChild(prevBtn)
    
    // Calculate page range to display
    const startPage = Math.max(1, page - 2)
    const endPage = Math.min(totalPages, page + 2)
    
    // Add first page if not in range
    if (startPage > 1) {
        const firstBtn = document.createElement('button')
        firstBtn.className = 'pagination-btn'
        firstBtn.textContent = '1'
        firstBtn.onclick = () => {
            currentPage = 1
            getApplications()
        }
        paginationContainer.appendChild(firstBtn)
        
        if (startPage > 2) {
            const dots = document.createElement('span')
            dots.textContent = '...'
            dots.style.padding = '0.6rem 1rem'
            dots.style.color = '#6b7280'
            paginationContainer.appendChild(dots)
        }
    }
    
    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button')
        pageBtn.className = `pagination-btn ${i === page ? 'active' : ''}`
        pageBtn.textContent = i
        pageBtn.onclick = () => {
            currentPage = i
            getApplications()
        }
        paginationContainer.appendChild(pageBtn)
    }
    
    // Add last page if not in range
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            const dots = document.createElement('span')
            dots.textContent = '...'
            dots.style.padding = '0.6rem 1rem'
            dots.style.color = '#6b7280'
            paginationContainer.appendChild(dots)
        }
        
        const lastBtn = document.createElement('button')
        lastBtn.className = 'pagination-btn'
        lastBtn.textContent = totalPages
        lastBtn.onclick = () => {
            currentPage = totalPages
            getApplications()
        }
        paginationContainer.appendChild(lastBtn)
    }
    
    // Next button
    const nextBtn = document.createElement('button')
    nextBtn.className = 'pagination-btn'
    nextBtn.textContent = 'Next »'
    nextBtn.disabled = page === totalPages
    nextBtn.style.opacity = page === totalPages ? '0.5' : '1'
    nextBtn.style.cursor = page === totalPages ? 'not-allowed' : 'pointer'
    nextBtn.onclick = () => {
        if (page < totalPages) {
            currentPage = page + 1
            getApplications()
        }
    }
    paginationContainer.appendChild(nextBtn)
}

async function editApplication(id) {
    try {
        // Store the application ID in localStorage
        localStorage.setItem('editApplicationId', id)
        // Redirect to the add/edit form
        window.location.href = '/addJob'
    } catch (error) {
        console.log(error)
        alert("Error loading application for editing")
    }
}

async function deleteApplication(id) {
    // Confirmation dialog
    if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
        return
    }
    
    try {
        // Send delete request
        const response = await axios.delete(`http://localhost:2000/addJob/delete/${id}`, {
            headers: { token }
        })
        
        alert(response.data.msg)
        
        // Refresh the applications list
        // The getApplications() function will automatically handle empty page redirection
        getApplications()
        
    } catch (error) {
        console.log(error)
        alert('Error deleting application. Please try again.')
    }
}