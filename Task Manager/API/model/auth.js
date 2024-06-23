// all user authenthication activity done here(register,login,logout, forget password,reset password, change password) 

let { User } = require("../schema/user");
let joi = require("joi");
let bcrypt = require("bcrypt");
let security = require("../helper/security");
let { sendMail } = require("../helper/mailer");
let otpGenerator = require("otp-generator");
let config = require("config");
let mailCredential = config.get("mailCredential");
let{validate}=require("../helper/validation");

// WHAT TO DO:->We Have To Register New User
// INPUT:->UserName,Email,Password,Contact,Age
// OUTPUT:->Success
async function register(params) {
    // user data validation 
    let schema = joi.object({
        userName: joi.string().min(2).max(155).required(),
        email: joi.string().email().max(255).required(),
        password: joi.string().min(8).max(16).required(),
    })

    let check=await validate(schema,params).catch((error)=>{
        return {error}
    })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // check if user exist 
    let user = await User.findOne({ where: { emailID: params.email } }).catch((error) => {
        return { error }
    })
    if (user) {
        return { error: "User already existed", status: 409 }
    }
    // hash password
    let password = await bcrypt.hash(params.password, 10).catch((error) => {
        return { error }
    })
    if (!password || (password && password.error)) {
        return { error: "Password is not created", status: 500 }
    }
    // data formating
    let data = {
        name: params.userName,
        emailID: params.email,
        password: password
    }

    // insert data 
    let insert = await User.create(data).catch((error) => { return { error } })
    if (!insert || (insert && insert.error)) {
        return { error: 'Internal Server Error', status: 500 }
    }

    let response = {
        id: insert.id,
        userName: insert.name,
        email: insert.emailID,
    }
    // return response
    return { data: response }
}

// WHAT TO DO:->We Have To Login the Register User
// INPUT:->Email,Password
// OUTPUT:->Login Successfull

async function login(params) {
    // user data validation
    let check = await validateLogin(params).catch((error) => {
        return { error }
    });
    console.log("login ",check);
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // check if user email exist in db
    let user = await User.findOne({ where: { emailID: params.email } }).catch((error) => {
        return { error }
    })
    if (!user || (user && user.error)) {
        return { error: "User Not Found", status: 404 }
    }
    // compare the password
    let compare = await bcrypt.compare(params.password, user.password).catch((error) => { return { error } });
    if (!compare || (compare && compare.error)) {
        return { error: "User email & Password Invalid", status: 403 }
    }
    // generate token
    let token = await security.signAsync({ id: user.id }).catch((error) => { return { error } });
    if (!token || (token && token.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    // save token in db
    let update = await User.update({ token }, { where: { id: user.id } }).catch((error) => { return { error } });
    if (!update || (update && update.error)) {
        return { error: "User Not Login Yet...! Please Try Again", status: 500 }
    }
    // return token in response 
    return { token }

}

async function validateLogin(data) {
    let schema = joi.object({
        email: joi.string().email().max(255).required(),
        password: joi.string().min(8).max(16).required(),

    })
    let valid = await schema.validateAsync(data, { abortEarly: false }).catch((error) => {
        return { error }
    })
    if (!valid || (valid && valid.error)) {
        let msg = []
        for (let i of valid.error.details) {
            msg.push(i.message);
        }
        return { error: msg }
    }
    return { data: valid }
}

// WHAT TO DO:->We Have To Make Api for Forget User Password
// INPUT:->Email
// OUTPUT:->Return OTP Via Mail
async function forgetPassword(params) {
    // user Data validation
    let schema = joi.object({
        email: joi.string().email().max(255).required()
    })
    let check=await validate(schema,params).catch((error)=>{
        return {error}
    })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // Check if Email Exist
    let user = await User.findOne({ where: { emailID: params.email } }).catch((error) => {
        return { error }
    })
    console.log("user", user);
    if (!user || (user && user.error)) {
        return { error: "Invalid User Email", status: 404 }
    }
    // Generate OTP
    let otp =otpGenerator.generate(4, { digits: true, upperCaseAlphabets: false, specialChars: false, })

    if (!otp || (otp && otp.error)) {
        return { error: "Internal Server Error", status: 503 }
    }

    // Hash OTP
    let hashOTP = await bcrypt.hash(otp, 10).catch((error) => {
        return { error }
    })
    if (!hashOTP || (hashOTP && hashOTP.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    // Save Hashed otp in DB
    let update = await User.update({ otp: hashOTP }, { where: { id: user.id } }).catch((error) => { return { error } })
    if (!update || (update && update.error)) {
        return { error: "Could Not Process The Request", status: 500 }
    }
    // Send normal OTP through email to User(!later)
    let mailOption = {
        to: params.email,
        from: mailCredential.user,
        subject: "Forget Password",
        text: `OTP for Reset Password is ${otp}`
    }
    let mail = await sendMail(mailOption).catch((error) => {
        return { error }
    })
    if (!mail || (mail && mail.error)) {
        return { error: "Not Able To Send OTP!", status: 500 }
    }

    // return Response
    return { data: "Update Successfully" }

}

// WHAT TO DO:->We Have To Reset User Password
// INPUT:->OTP,Email,New Password
// OUTPUT:->Password Has Been Reset

async function resetPassword(params) {
    // user Data validation
    let schema=joi.object({
        otp:joi.string().min(4).max(4).required(),
        email:joi.string().max(255).required(),
        password:joi.string().min(8).max(16).required()
    })

    let check=await validate(schema,params).catch((error)=>{
        return {error}
    })
    if(!check || (check && check.error)){
        return {error:check.error,status:400}
    }

    // check if email exist
    let user=await User.findOne({where:{emailID:params.email}}).catch((error)=>{
        return {error}
    })
    // console.log("User data",user);
    if(!user || (user && user.error)){
        return {error:"User Not Found",status:404}
    }
    // Compare OTP
    let compare=await bcrypt.compare(params.otp,user.otp).catch((error)=>{
        return {error}
    })
    if(!compare || (compare && compare.error)){
        return {error:"Invalid OTP",status:400}
    }
    // Hash Password
    let password=await bcrypt.hash(params.password,10).catch((error)=>{
        return {error}
    })
    if(!password || (password && password.error)){
        return {error:"Internal Server Error",status:500}
    }
    // Update password in DB
    let update=await User.update({password:password,otp:""},{where:{id:user.id}}).catch((error)=>{
        return {error}
    })
    if(!update || (update && update.error)){
        return {error:"Password Could Not Update",status:500}
    }
    // Return Response
    return {data:"Password Updated"}

 
}

// WHAT TO DO:->We Have To Logout User
// INPUT:->Id
// OUTPUT:->Logout Successfully

async function logout(userData) {
        // User Data Validation
    let schema=joi.object({
        id:joi.number().required()
    })

    let check=await validate(schema,{id:userData.id}).catch((error)=>{
        return {error}
    })
    if(!check || (check && check.error)){
        return {error:check.error,status:400}
    }
    // Update token as empty in DB
    let update =await User.update({token:""},{where:{id:userData.id}}).catch((error)=>{
        return {error}
    })
    if(!update || (update && update.error)){
        return {error:"Not Logout",status:500}
    }
    // Return Response
    return {data:"Success"}
}

// WHAT TO DO:->We Have To Change User Password
// INPUT:->Old Password, New Password
// OUTPUT:->Password Has Been Changed Successfully

async function changePassword(params,userData){
    // User Data Validation
    let schema=joi.object({
        oldPassword:joi.string().min(8).max(16).required(),
        newPassword:joi.string().min(8).max(16).required()
    })

    let check=await validate(schema,params).catch((error)=>{
        return {error}
    })
    if(!check || (check && check.error)){
        return {error:check.error,status:400}
    }
    // fetch User Data From DB
    let user=await User.findOne({where:{id:userData.id}}).catch((error)=>{
        return {error}
    })
    if(!user || (user && user.error)){
        return {error:"User Not Found",status:404}
    }
    console.log("user",user);

    // Compare Old Password
    let compare=await bcrypt.compare(params.oldPassword,user.password).catch((error)=>{
        return {error}
    })
    console.log("compare",compare);
    if(!compare || (compare && compare.error)){
        return {error:"Invalid Password",status:400}
    }
    // Hash New Password
    let hash=await bcrypt.hash(params.newPassword,10).catch((error)=>{
        return{error}
    })
    console.log("hash",hash);
    if(!hash || (hash && hash.error)){
        return {error:"Internal Server Error",status:500}
    }
    // Update Password in DB

    let update=await User.update({password:hash,token:""},{where:{id:user.id}}).catch((error)=>{
        return {error}
    })
    if(!update || (update && update.error)){
        return {error:"Password Could Not Change...!!!Please Try Again",status:500}
    }
    // Return Response
    return {data:"Success"}

}

module.exports = { register, login, logout,changePassword, forgetPassword,resetPassword }


