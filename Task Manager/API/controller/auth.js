let auth = require("../model/auth")


async function register(req, res) {
    // return res.send("hello") 
    let data = await auth.register(req.body).catch((error) => {
        return { error }
    })
    console.log("con data",data)
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error"
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}

async function login(req, res) {
    let data = await auth.login(req.body).catch((error) => {
        return { error }
    })
    console.log("data",data);
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error"
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.header({ "Access-Control-Expose-Headers": "token", "token": data.token }).send({ status: " User Login Successfully" })

}

async function forgetPassword(req, res) {
    let data = await auth.forgetPassword(req.body).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error"
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ status: "Success" })
}

async function resetPassword(req, res) {
    let data = await auth.resetPassword(req.body).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error"
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ status: "Update Password Successfully" })
}

async function logout(req, res) {
    let data = await auth.logout(req.userData).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error"
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ status: "User Logout Successfully" })

}

async function changePassword(req, res) {
    let data = await auth.changePassword(req.body, req.userData).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error"
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ status: "Password Has Been Changed Successfully" })
}


module.exports = { register, login, logout, forgetPassword, changePassword, resetPassword }