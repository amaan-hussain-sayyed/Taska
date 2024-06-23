import { logoutUser } from "../Services/authService";
import { useNavigate } from "react-router-dom"
import { useDispatch,useSelector } from "react-redux";
import { logout } from "../Store/authSlice";
import { useEffect } from "react";


function Logout() {
    let dispatch = useDispatch()
    let navigate = useNavigate();
    let userInfo= useSelector((state)=>{return state.auth.userInfo})
    useEffect(() => {
        handleLogout()
    }, [])
    async function handleLogout() {
        let data = await logoutUser(userInfo.token).catch((error) => {
            return { error }
        })
        if (data.error) {
            navigate("/task")
        }
        dispatch(logout())
        navigate("/login")
    }
    return (
        <h2>Logout</h2>
    )
}

export default Logout;