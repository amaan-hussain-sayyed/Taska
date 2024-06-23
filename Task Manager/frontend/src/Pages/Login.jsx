import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup"
import { validator } from "../Utils/project";
import { login } from "../Services/authService";
import { setCredentials } from "../Store/authSlice";
import "../style.css"

function Login() {
    let dispatch = useDispatch()
    let userInfo = useSelector((state) => state.auth.userInfo)
    let navigate = useNavigate();
    let initialVal = { email: "", password: "" }
    const [formData, setFormData] = useState(initialVal)
    const [error, setError] = useState({});

    useEffect(() => {
        if (userInfo) {
            navigate("/task")
        }
    }, [userInfo, navigate])

    async function handleSubmit(e) {
        e.preventDefault();
        let schema = yup.object({
            email: yup.string().email().max(255).required(),
            password: yup.string().min(8).max(16).required()
        })
        let valid = await validator(schema, formData).catch((error) => {
            return { error }
        })
        if (valid.error) {
            return setError(valid.error)
        }
        let data = await login(formData).catch(error => { return { error } });
        if (data.error) {
            return alert("Invalid email or password. Please try again.")
        }
        dispatch(setCredentials(data))
        setFormData(initialVal);
        setError({})
    }

    function handleChange(e) {
        let tempData = { ...formData }
        tempData[e.target.name] = e.target.value;
        setFormData(tempData)
    }

    function handleRegisterClick() {
        // Redirect to registration page
        navigate("/register");
    }
    function handleForgetPassword() {
        navigate("/forgetPassword")
    }

    return (
        <>
            <div className="img-container">
                <div className="login-box">
                    <form onSubmit={handleSubmit}>
                        <h1>Login</h1>
                        <label>Email</label>
                        <div className="input-box">
                            <input type="email" name="email" placeholder="Enter Email..." value={formData.email} onChange={handleChange} />
                            <i class='bx bxs-envelope' ></i>
                            {error.email && <p>{error.email}</p>}
                        </div>
                        <label>Password</label>
                        <div className="input-box">
                            <input type="password" name="password" placeholder="Enter Password..." value={formData.password} onChange={handleChange} />
                            <i class='bx bxs-lock-open-alt'></i>
                            {error.password && <p>{error.password}</p>}
                        </div>
                        <div>
                            <input type="checkbox" id="remember-me" name="remember-me" />
                            <label htmlFor="remember-me">Remember Me</label>
                        </div>
                        <p><a href="#" onClick={handleForgetPassword}>Forgot Password?</a></p>
                        <button type="submit">Login</button>
                        <p>Don't have an Account? <a href="#" onClick={handleRegisterClick}>Register</a></p>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Login;