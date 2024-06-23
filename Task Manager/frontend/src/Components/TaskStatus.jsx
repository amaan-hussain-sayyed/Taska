import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as yup from "yup"
import { validator } from "../Utils/project"
import { taskStatus } from "../Services/taskService"

function TaskStatus() {
    const { id } = useParams();
    const [status, setStatus] = useState({ statusCode: "" });
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        // Schema for validation
        let schema = yup.object({
            statusCode: yup.number().required().integer().positive().max(8) 
        });

        // Validate the form data
        // let check = await schema.validate(status, { abortEarly: false }).catch((err) => {
        //     return { error: err.errors }
        // });

        // if (check.error) {
        //     setError(check.error.join(', ')); 
        //     return;
        // }
        let check=await validator(schema,status).catch((error)=>{
            return {error}
        })

        // Call the API to update the task status
        let data = await taskStatus(id, status).catch((error) => {
            return { error: error.message };
        });

        if (data.error) {
            setError(data.error);
        } else {
            setError("");
        }
    }

    function handleChange(e) {
        setStatus({ statusCode: e.target.value });
    }

    return (
        <div className="taskStatus">
            <h1>Update Task Status</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="status">Status</label>
                <input
                    type="number"
                    name="status"
                    className='outline-none'
                    value={status.statusCode}
                    onChange={handleChange}
                />
                <button type="submit">Submit</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
        </div>
    );
}

export default TaskStatus;
