import { useState } from "react";
import { validator } from "../Utils/project"
import * as yup from "yup"
import { forgetPassword } from "../Services/authService";
import { useNavigate } from "react-router-dom";

function ForgetPassword() {
    let navigate = useNavigate();
    let initialVal = {
        email: ''
    }
    const [email, setEmail] = useState(initialVal);
    const [error, setError] = useState({});

    async function handleSubmit(e) {
        e.preventDefault();
        let schema = yup.object({
            email: yup.string().email().max(255).required()
        })

        let check = await validator(schema, email).catch((error) => {
            return { error }
        })
        if (check.error) {
            return setError(check.error)
        }

        let data = await forgetPassword(email).catch((error) => {
            return { error }
        })
        if (data.error) {
            return setError("Please Try again Later")
        }
        setEmail(navigate("/resetPassword"));
        setError({})
    }

    function handleChange(e) {
        let temData = { ...email }
        temData[e.target.name] = e.target.value;
        setEmail(temData);
    }

    return (
        <>
            <div className="img-container">
                <div className="Forget-password">
                    <form onSubmit={handleSubmit}>
                        <h1>Forget Password</h1>
                        <div className="input-box">
                            <input type="email" name="email" value={email.email} placeholder="Enter Your Email..." onChange={handleChange} />
                            <i class='bx bxs-envelope' ></i>
                            {error.email && <p>{error.email}</p>}
                        </div>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ForgetPassword;