let baseUrl = "http://localhost:3150/";

async function registerUser(userData) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    }
    let res = await fetch(baseUrl + "Register", options).catch((error) => {
        return { error }
    })
    console.log("res",res);
    if (res.error) {
        return { error: res.error }
    }
    let data = await res.json().catch((error) => {
        return { error }
    })
    if (data.error) {
        return { error: "" }
    }
    return data
}

async function login(userData) {
    // let url="http://localhost:3150/Login"
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    }
    let res = await fetch(`${baseUrl}Login`, options).catch((error) => {
        return { error }
    })
    if (res.error) {
        return { error: res.error }
    }
    let data = await res.json().catch(error => { return error })
    if (data.error) {
        return { error: "" }
    }
    data["token"] = res.headers.get("token")
    return data;
}

async function logoutUser(token) {
    let options = {
        method: "PUT",
        headers: {
            "token": token
        }
    }
    let res = await fetch(`${baseUrl}Logout`, options).catch((error) => {
        return { error }
    })
    if (res.error) {
        return { error: res.error }
    }
    return { success: true + "Successfully logged out." }
}

async function forgetPassword(userData){
    let options={
        method:"PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(userData)
    }
    let response=await fetch(baseUrl +"ForgetPassword",options).catch((error)=>{
        return {error}
    })
    console.log("forget pass Response",response);
    if(response.error){
        return {error:response.error}
    }
    let data=await response.json().catch((error)=>{
        return {error}
    })
    console.log("forget pass Response",response);
    if(data.error){
        return {error:data.error}
    }
    return data;
}

async function resetPassword(userData){
    let options={
        method:"PUT",
        headers:{
            "Content-Type": "application/json"
        },
        body:JSON.stringify(userData)
    }
    let response=await fetch(baseUrl +"ResetPassword",options).catch((error)=>{
        return {error}
    })
    if(response.error){
        return {error:response.error}
    }
    let data=await response.json().catch((error)=>{
        return {error}
    })
    if(data.error){
        return {error:data.error}
    }
    return data;
}

async function PasswordChange(userData){
    let options={
        method:"PUT",
        headers:{
            "Content-Type":"application/json",
            "token":JSON.parse(localStorage.getItem("userInfo")).token
        },
        body:JSON.stringify(userData)
    }
    let response=await fetch(baseUrl + "ChangePassword",options).catch((error)=>{
        return {error}
    })
    if(response.error){
        return {error:response.error}
    }
    let data=await response.json().catch((error)=>{
        return {error}
    })
    if(data.error){
        return {error:data.error}
    }
    return data;

}
export { login, logoutUser,registerUser,forgetPassword,resetPassword,PasswordChange };