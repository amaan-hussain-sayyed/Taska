import { useNavigate, useParams } from "react-router-dom";
import { singleTaskDetails, taskEdit } from "../Services/taskService"
import { useState, useEffect } from "react";
import * as yup from "yup"
import { validator } from "../Utils/project";
import Button from 'react-bootstrap/Button';
import { useDispatch } from "react-redux";
import { updateTask } from "../Store/taskSlice";


function TaskUpdate() {
    let { id } = useParams()
    let initialValue = { taskName: "", taskDescription: "" }
    const [formData, setFormData] = useState(initialValue)
    const [error, setError] = useState({})
    const [status, setStatus] = useState(false)
    let dispatch = useDispatch()
    let navigate = useNavigate()
    useEffect(() => {
        getTask()
    }, [])

    async function getTask() {
        let data = await singleTaskDetails(id).catch((error) => {
            return { error }
        })
        if (data.error) {
            setStatus(false);
            return alert(data.error)
        }
        console.log("data update", data);
        let tempData = {
            taskName: data.taskName,
            taskDescription: data.taskDescription,
            expectedStartDate: data.expectedStartDate,
            expectedEndDate: data.expectedEndDate,
            startDate: data.startDate,
            endDate: data.endDate
        }
        setFormData(tempData);
    }

    function handleChange(e) {
        let tempData = { ...formData }
        tempData[e.target.name] = e.target.value
        setFormData(tempData)

    }

    async function handleSubmit(e) {
        e.preventDefault();
        let schema = yup.object({
            taskName: yup.string().min(5).max(155),
            taskDescription: yup.string().min(15).max(500),
            expectedStartDate: yup.date().nullable(true),
            expectedEndDate: yup.date().nullable(true),
            startDate: yup.date().nullable(true),
            endDate: yup.date().nullable(true)
        })
        let valid = await validator(schema, formData).catch((error) => {
            return { error }
        })
        if (valid.error) {
            setStatus(false);
            return setError(valid.error)
        }

        let data = await taskEdit(formData, id).catch((error) => {
            return { error }
        })
        if (data.error) {
            setStatus(false);
            return setError(data.error)
        }
        dispatch(updateTask({ ...formData, ["id"]: id }))
        setStatus(true)
        navigate("/task/" + id)
    }

    return (
        <>
            <div className="img-container">
                <div className="update-form">
                    {
                        status && <p>Task Successfully Updated</p>
                    }
                    {
                        Array.isArray(error) && error.map((error, index) => {
                            return <p key={index}>{error}</p>
                        })
                    }
                    <form onSubmit={handleSubmit}>
                        <h1>Update Task</h1>
                        <div>
                            <label>Task Name</label>
                            <input type="text" name="taskName" value={formData.taskName} onChange={handleChange} placeholder="Enter TaskName" />
                            {error.taskName && <p>{error.taskName}</p>}
                        </div>
                        <div>
                            <label>Task Description</label>
                            <input type="text" name="taskDescription" value={formData.taskDescription} onChange={handleChange} placeholder="Enter taskDescription" />
                            {error.taskDescription && <p>{error.taskDescription}</p>}
                        </div>
                        <div>
                            <label>Expected Start Date</label>
                            <input type="date" name="expectedStartDate" value={formData.expectedStartDate} onChange={handleChange} />
                            {error.expectedStartDate && <p>{error.expectedStartDate}</p>}
                        </div>
                        <div>
                            <label>Expected End Date</label>
                            <input type="date" name="expectedEndDate" value={formData.expectedEndDate} onChange={handleChange} />
                            {error.expectedEndDate && <p>{error.expectedEndDate}</p>}
                        </div>
                        <div>
                            <label>Start Date</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
                            {error.startDate && <p>{error.startDate}</p>}
                        </div>
                        <div>
                            <label>End Date</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
                            {error.endDate && <p>{error.endDate}</p>}
                        </div>
                        <Button variant="primary" type="submit">UPDATE</Button>
                    </form>
                </div>
                </div>
            </>
            )

}

            export default TaskUpdate;