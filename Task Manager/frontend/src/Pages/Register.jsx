import { useState } from "react";
import * as yup from "yup"
import { validator } from "../Utils/project";
import { registerUser } from "../Services/authService";
import { useNavigate } from "react-router-dom";
import "../responsive.css"

function Register() {
    let navigate = useNavigate()
    let initialVal = {
        userName: "",
        email: "",
        password: "",
    }
    let [formData, setFormData] = useState(initialVal);
    let [error, setError] = useState({})

    async function handleSubmit(e) {
        e.preventDefault()
        let schema = yup.object({
            userName: yup.string().min(2).max(155).required(),
            email: yup.string().email().max(255).required(),
            password: yup.string().min(8).max(16).required(),
        })
        let check = await validator(schema, formData).catch((error) => {
            return { error }
        })
        console.log("check data", check);
        if (check.error) {
            return setError(check.error)
        }
        let data = await registerUser(formData).catch((error) => {
            return { error }
        })
        console.log("data", data);
        if (data.error) {
            return alert("An error occurred during registration. Please try again later.")
        }
        setFormData(initialVal)
        setError({})
    }
    function handleChange(e) {
        let tempData = { ...formData }
        tempData[e.target.name] = e.target.value;
        setFormData(tempData)
    }

    function handleLogin() {
        navigate("/login")
    }

    return (
        <>
        <div className="img-container">
            <div className="Register-form ">
                <form onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <div className="input-box">
                        <input type="text" name="userName" placeholder="Enter UserName..." value={formData.userName} onChange={handleChange} />
                        <i class='bx bxs-user'></i>
                        {error.userName && <p>{error.userName}</p>}
                    </div>
                    <div className="input-box">
                        <input type="email" name="email" placeholder="Enter Email..." value={formData.email} onChange={handleChange} />
                        <i class='bx bxs-envelope' ></i>
                        {error.email && <p>{error.email}</p>}
                    </div>
                    <div className="input-box">
                        <input type="password" name="password" placeholder="Enter Password" value={formData.password} onChange={handleChange} />
                        <i class='bx bxs-lock-alt' ></i>
                        {error.password && <p>{error.password}</p>}
                    </div>
                    <button type="submit" className="btn">Register</button>
                    <div className="login-link">
                        <p>Sign Up Here <a href="#" onClick={handleLogin}>Login</a></p>
                    </div>
                </form>
            </div>
            </div>
        </>
    )
}

export default Register;