import { useState } from "react";
import * as yup from "yup";
import { validator } from "../Utils/project"
import { PasswordChange } from "../Services/authService";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from 'react-icons/fa';


function ChangePassword() {
    let navigate = useNavigate();
    let initialVal = {
        oldPassword: "",
        newPassword: ""
    }
    const [formData, setFormData] = useState(initialVal)
    const [error, setError] = useState({})


    async function handleSubmit(e) {
        e.preventDefault();
        let schema = yup.object({
            oldPassword: yup.string().min(8).max(16).required(),
            newPassword: yup.string().min(8).max(16).required()
        })
        let valid = await validator(schema, formData).catch((error) => {
            return { error }
        })
        if (valid.error) {
            return setError(valid.error)
        }
        let data = await PasswordChange(formData).catch((error) => {
            return { error }
        })
        if (data.error) {
            return setError(data.error)
        }
        setEmail(navigate("/login"));
        setError({})
    }

    function handleChange(e) {
        let tempData = { ...formData }
        tempData[e.target.name] = e.target.value
        setFormData(tempData)
    }

    return (
        <>
            <div className="img-container">
                <div className="Change-Password">
                    <form onSubmit={handleSubmit}>
                        <h1>Change Password</h1>
                        <div className="input-box">
                            <input type="text" name="oldPassword" placeholder="Enter Old Password..." value={formData.oldPassword} onChange={handleChange} />
                            {error.oldPassword && <p>{error.oldPassword}</p>}
                        </div>
                        <div className="input-box">
                            <input type="password" name="newPassword" placeholder="Enter Old Password..." value={formData.newPassword} onChange={handleChange} />
                            {error.newPassword && <p>{error.newPassword}</p>}
                        </div>
                        <button type="submit" className="btn">Change Password</button>
                    </form>
                </div>
                </div>
            </>
            )
}
            export default ChangePassword;