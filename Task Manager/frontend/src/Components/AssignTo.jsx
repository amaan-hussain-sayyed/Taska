import { useState } from "react";
 import { useParams } from "react-router-dom";
import * as yup from "yup";
import { validator } from "../Utils/project";
 import { assignTo } from "../Services/taskService";

function AssignTo() {
    let { id } = useParams();
    let initialVal = {
        userEmail: ""
    }
    let [user, setUser] = useState(initialVal);
    let [error, setError] = useState({});
    
    async function handleSubmit(e) {
        e.preventDefault();
        let schema = yup.object({
            userEmail: yup.string().email().required(),
        });
        let check = await validator(schema, user).catch((error) => {
            return { error }
        });
        console.log("COmpo check",check);
        if (check.error) {
            setError(check.error)
        }
        let data = await assignTo(id, user).catch((error) => {
            return { error }
        });
        console.log("COmpo data",data);

        if (data.error) {
            setError(data.error)
        }
        console.log("User state:", user);
        setUser(initialVal);
        setError({});
    }

    function handleChange(e) {
        let tempData = { ...user };
        tempData[e.target.name] = e.target.value;
        setUser(tempData);
    }

    return (
        <div className="AssignTo">
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="email" name="userEmail" placeholder="Enter Email..." value={user.userEmail} onChange={handleChange} />
                    {error.userEmail && <p>{error.userEmail}</p>}
                    <button className="btn" type="submit">Assign</button>
                </div>
            </form>
        </div>
    );
}

export default AssignTo;
