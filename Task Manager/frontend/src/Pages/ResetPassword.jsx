import { useState } from "react";
import { validator } from "../Utils/project";
import * as yup from "yup"
import { resetPassword } from "../Services/authService";

function ResetPassword(){
    let initialVal={
        otp:"",
        email:"",
        password:""
    }
    const[formData,setFormData]=useState(initialVal)
    const [error,setError]=useState({})

    async function handleSubmit(e){
        e.preventDefault();
        let schema=yup.object({
            otp:yup.string().min(4).max(4).required(),
            email:yup.string().max(255).required(),
            password:yup.string().min(8).max(16).required()
        })

        let check=await validator(schema,formData).catch((error)=>{
            return {error}
        })
        if(check.error){
            return setError(check.error)
        }
        let data=await resetPassword(formData).catch((error)=>{
            return {error}
        })
        if(data.error){
            return setError(data.error)
        }
        setFormData(initialVal)
        setError({})
    }

    function handleChange(e){
        setFormData({...formData,[e.target.name]:e.target.value})
    }

    return (
        <>
                <div className="img-container">
        <div className="Reset-form">
            <form onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <div className="input-box">
                    <input type="text" name="otp" placeholder="Enter OTP..." value={formData.otp} onChange={handleChange}/>
                    {error.otp && <p>{error.otp}</p>}
                </div>
                <div className="input-box">
                    <input type="email" name="email" placeholder="Enter email..." value={formData.email} onChange={handleChange}/>
                    <i class='bx bxs-envelope' ></i>
                    {error.email && <p>{error.email}</p>}
                </div>
                <div className="input-box">
                    <input type="password" name="password" placeholder="Enter password..." value={formData.password} onChange={handleChange}/>
                    <i class='bx bxs-lock-alt' ></i>
                    {error.password && <p>{error.password}</p>}
                </div>
                <button type="submit" className="btn">Reset Password</button>
            </form>
        </div>
        </div>
        </>
    )
}
export default ResetPassword;