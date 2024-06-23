let mailer=require("nodemailer");
let config= require("config");
let mailcredential= config.get("mailCredential")

let transport= mailer.createTransport({
    host:"smtp.gmail.com",
    port:"465",
    secure:true,
    auth:mailcredential
})


module.exports={transport}