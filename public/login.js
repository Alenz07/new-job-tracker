console.log("data is linked")
async function Login(event){
    event.preventDefault()
    obj = {
        Mail_Phone :document.getElementById("mailorpass").value,
        password :document.getElementById("password").value
    } 
    try {
       const log = await axios.post("http://localhost:2000/log",obj)
       console.log(log.data.msg)
       console.log(log.data.token)
       localStorage.setItem("token",log.data.token)

        window.location.href  ="http://localhost:2000/jobView"
    } catch (error) {
        console.log(error)
    }  
}