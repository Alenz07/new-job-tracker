console.log("this is workin")
async function signUP(event){
    event.preventDefault()
    const errList = document.createElement("li")
    document.body.appendChild(errList)

    obj = {
       name_user : document.getElementById("name_user").value,
       phone_no :document.getElementById("number").value,
       email:  document.getElementById("email").value,
       password :document.getElementById("password").value
    }
try {
   const sending = await axios.post("http://localhost:2000/signup",obj)
   console.log(sending.data)
   errList.innerText = sending.data.msg
   
} catch (error) {
    console.log(error)
    
    errList.innerText = error.msg
}
}