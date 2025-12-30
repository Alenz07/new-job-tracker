console.log("companies.js loaded")
const token = localStorage.getItem("token")

let currentPage = 1
let currentFilters = {
    search: '',
    industry: ''
}

window.onload = () => {
    loadCompanies()
}

async function loadCompanies() {
    try {
        const params = new URLSearchParams({
            page: currentPage,
            limit: 10
        })
        
        if (currentFilters.search) {
            params.append('search', currentFilters.search)
        }
        
        if (currentFilters.industry) {
            params.append('industry', currentFilters.industry)
        }
        
        const response = await axios.get(`http://localhost:2000/company/get?${params}`, {
            headers: { token }
        })
        
        const { companies, pagination } = response.data
        
        renderCompanies(companies)
        renderPagination(pagination)
        
    } catch (error) {
        console.log(error)
        alert("Error loading companies")
    }
}

function renderCompanies(companies) {
    const container = document.getElementById("companiesList")
    container.innerHTML = ""
    
    if (companies.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 3rem; color: #6b7280;">
                <h3>No companies found</h3>
                <p>Add companies to keep track of your research</p>
            </div>
        `
        return
    }
    
    companies.forEach(company => {
        const card = document.createElement("div")
        card.className = "company-card"
        card.innerHTML = `
            <div class="company-header">
                <h3 class="company-name">${company.companyName}</h3>
            </div>
            <div class="company-details">
                <div class="detail-item">
                    <strong>Location:</strong> ${company.location}
                </div>
                <div class="detail-item">
                    <strong>Industry:</strong> ${company.industry}
                </div>
                <div class="detail-item">
                    <strong>Avg Package:</strong> ${company.avgPackage} LPA
                </div>
            </div>
            <div class="detail-item" style="margin-bottom: 1rem;">
                <strong>Notes:</strong><br>
                ${company.notes}
            </div>
            <div class="btn-group">
                <button class="btn-action btn-edit" onclick="editCompany(${company.id})">Edit</button>
                <button class="btn-action btn-delete" onclick="deleteCompany(${company.id})">Delete</button>
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
    
    // Previous button
    const prevBtn = document.createElement('button')
    prevBtn.className = 'pagination-btn'
    prevBtn.textContent = '« Previous'
    prevBtn.disabled = page === 1
    prevBtn.onclick = () => {
        if (page > 1) {
            currentPage = page - 1
            loadCompanies()
        }
    }
    container.appendChild(prevBtn)
    
    // Page numbers
    for (let i = Math.max(1, page - 2); i <= Math.min(totalPages, page + 2); i++) {
        const pageBtn = document.createElement('button')
        pageBtn.className = `pagination-btn ${i === page ? 'active' : ''}`
        pageBtn.textContent = i
        pageBtn.onclick = () => {
            currentPage = i
            loadCompanies()
        }
        container.appendChild(pageBtn)
    }
    
    // Next button
    const nextBtn = document.createElement('button')
    nextBtn.className = 'pagination-btn'
    nextBtn.textContent = 'Next »'
    nextBtn.disabled = page === totalPages
    nextBtn.onclick = () => {
        if (page < totalPages) {
            currentPage = page + 1
            loadCompanies()
        }
    }
    container.appendChild(nextBtn)
}

function searchCompanies() {
    currentFilters.search = document.getElementById("searchInput").value
    currentPage = 1
    loadCompanies()
}

function filterCompanies() {
    currentFilters.industry = document.getElementById("industryFilter").value
    currentPage = 1
    loadCompanies()
}

async function editCompany(id) {
    localStorage.setItem('editCompanyId', id)
    window.location.href = '/addCompany'
}

async function deleteCompany(id) {
    if (!confirm('Are you sure you want to delete this company?')) {
        return
    }
    
    try {
        const response = await axios.delete(`http://localhost:2000/company/delete/${id}`, {
            headers: { token }
        })
        
        alert(response.data.msg)
        loadCompanies()
    } catch (error) {
        console.log(error)
        alert("Error deleting company")
    }
}

function logout() {
    localStorage.removeItem("token")
    window.location.href = "/login"
}