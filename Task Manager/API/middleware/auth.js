let {verifyAsync}=require("../helper/security");
let {User}=require("../schema/user")

async function auth(req,res,next){
    // check if Token Exist
    let token= req.header("token")
    if(typeof(token)!="string"){
        return res.status(400 ).send({error:"Please Provide Correct Token"})
    }
    console.log("token",token);

    // decrypt token
    let decryptedToken=await verifyAsync(token).catch((error)=>{
        return {error}
    })
    console.log("decrypt",decryptedToken);
    if(!decryptedToken || (decryptedToken && decryptedToken.error)){
        return res.status(403).send({error:"Invalid Token"})
    }
    // check if user id and token are present in DB
    let user=await User.findOne({where:{token:token,id:decryptedToken.id}}).catch((error)=>{
        return {error}
    })
    console.log("user",user);

    if(!user || (user && user.error)){
        return res.status(403).send({error:"Access Denied"})
    }
    // check if user is not Deleted
    if(user.isDeleted){
        return res.status(403).send({error:"User Data Has Been Deleted"})
    }

    req["userData"]={
        id:user.id,
        email:user.emailID,
        name:user.name,
        isActive:user.isActive
    }
    // pass req to next function
    next()
}

module.exports= auth;