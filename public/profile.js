console.log("yes working")
const token = localStorage.getItem("token")

window.onload = () => {
    fillData()
}

async function fillData() {
    try {
        const response = await axios.get("http://localhost:2000/profile/fill", {headers: {token}})
        const name = document.getElementById("nameUser")
        const email = document.getElementById("emailUser")
        const skills = document.getElementById("skillsUser")
        const education = document.getElementById("educationUser")
        const experience = document.getElementById("experienceUser")
        const currentResume = document.getElementById("currentResume")
        
        name.value = response.data.data.name || ""
        email.value = response.data.data.email || ""
        
        if(response.data.dataInfo != null) {
            skills.value = response.data.dataInfo.skills || ""
            education.value = response.data.dataInfo.education || ""
            experience.value = response.data.dataInfo.experience || ""
            
            if(response.data.dataInfo.resumePath) {
                const resumeName = response.data.dataInfo.resumePath.split('/').pop()
                currentResume.textContent = `Current resume: ${resumeName}`
            }
        }
    } catch (error) {
        console.log(error)
    }
}

async function updateProfile(event) {
    event.preventDefault()
    
    const formData = new FormData()
    formData.append('name', document.getElementById("nameUser").value)
    formData.append('skills', document.getElementById("skillsUser").value)
    formData.append('education', document.getElementById("educationUser").value)
    formData.append('experience', document.getElementById("experienceUser").value)
    
    const resumeFile = document.getElementById("resumeFile").files[0]
    if(resumeFile) {
        formData.append('resume', resumeFile)
    }
    
    try {
        const updating = await axios.post("http://localhost:2000/profile/update", formData, {
            headers: {
                token,
                'Content-Type': 'multipart/form-data'
            }
        })
        alert(updating.data.msg)
        fillData()
    } catch (error) {
        console.log(error.response?.data || error)
        alert(error.response?.data?.msg || "Error updating profile")
    }
}