console.log("company.js is working")
const token = localStorage.getItem("token")
const editId = localStorage.getItem('editCompanyId')

window.onload = () => {
    if (editId) {
        loadCompanyData(editId)
        document.querySelector('h2').textContent = 'Edit Company Information'
        document.querySelector('button[type="submit"]').textContent = 'Update Company'
    }
}

async function loadCompanyData(id) {
    try {
        const response = await axios.get(`http://localhost:2000/company/get/${id}`, {
            headers: { token }
        })
        
        const data = response.data
        
        // Pre-fill form with existing data
        document.getElementById("companyName").value = data.companyName
        document.getElementById("location").value = data.location
        document.getElementById("industry").value = data.industry
        document.getElementById("avgPackage").value = data.avgPackage
        document.getElementById("notes").value = data.notes || ''
        
    } catch (error) {
        console.log(error)
        alert("Error loading company data")
        localStorage.removeItem('editCompanyId')
        window.location.href = '/companies'
    }
}

async function addCompanyInfo(event) {
    event.preventDefault();
    
    const data = {
        companyName: document.getElementById("companyName").value,
        location: document.getElementById("location").value,
        industry: document.getElementById("industry").value,
        avgPackage: document.getElementById("avgPackage").value,
        notes: document.getElementById("notes").value
    };

    try {
        if (editId) {
            // Update existing company
            const response = await axios.put(
                `http://localhost:2000/company/update/${editId}`, 
                data, 
                { headers: { token } }
            );
            alert(response.data.msg);
            localStorage.removeItem('editCompanyId')
        } else {
            // Create new company
            const response = await axios.post(
                "http://localhost:2000/company/add", 
                data, 
                { headers: { token } }
            );
            alert(response.data.msg);
        }
        
        // Clear form
        document.getElementById("companyForm").reset();
        
        // Redirect to companies list
        window.location.href = '/companies'
        
    } catch (error) {
        console.log(error);
        alert(error.response?.data?.msg || "Error saving company information")
    }
}

function cancelEdit() {
    localStorage.removeItem('editCompanyId');
    window.location.href = '/companies';
}