import { useState } from "react";
import * as yup from "yup";
import { validator } from "../Utils/project";
import { addTask } from "../Services/taskService";
import { useNavigate } from "react-router-dom";

function TaskAdd() {
    let initialVal = {
        taskName: "",
        taskDescription: ""
    }
    const [formData, setFormData] = useState(initialVal)
    const [error, setError] = useState({})
    let navigate = useNavigate()

    function handleChange(e) {
        let tempData = { ...formData }
        tempData[e.target.name] = e.target.value;
        setFormData(tempData)

    }
    async function handleSubmit(e) {
        e.preventDefault();
        let schema = yup.object({
            taskName: yup.string().min(5).max(155).required(),
            taskDescription: yup.string().min(15).max(500).required(),
            expectedStartDate: yup.date().nullable(true),
            expectedEndDate: yup.date().nullable(true),
            startDate: yup.date().nullable(true),
            endDate: yup.date().nullable(true)
        })
        let check = await validator(schema, formData).catch((error) => {
            return { error }
        })
        if (check.error) {
            return setError(check.error)
        }
        let data = await addTask(formData).catch((error) => {
            return { error }
        })
        if (data.error) {
            return setError(data.error)
        }
        navigate('/task/' + data.id)
    }
    return (
        <>
            {
                Array.isArray(error) && error.map((err, index) => {
                    return <p key={index} className="text-danger">{err.message}</p>
                })
            }
            <div className="img-container">
                <div className="addTask-form">
                    <form onSubmit={handleSubmit}>
                        <h1>Add Task</h1>
                        <div className="input-box">
                            <label>Task Name</label>
                            <input type="text" name="taskName" placeholder="Enter Task Name..." value={formData.taskName} onChange={handleChange} />
                            {error.taskName && <p>{error.taskName}</p>}
                        </div>
                        <div className="input-box">
                            <label>Task Description</label>
                            <input type="text" name="taskDescription" placeholder="Enter Task Description..." value={formData.taskDescription} onChange={handleChange} />
                            {error.taskDescription && <p>{error.taskDescription}</p>}
                        </div>
                        <div className="input-box">
                            <label> Expected Start Date</label>
                            <input type="date" name="expectedStartDate" placeholder="Enter Expected Start Date..." value={formData.expectedStartDate} onChange={handleChange} />
                            {error.expectedStartDate && <p>{error.expectedStartDate}</p>}
                        </div>
                        <div className="input-box">
                            <label> Expected End Date</label>
                            <input type="date" name="expectedEndDate" placeholder="Enter Expected End Date..." value={formData.expectedEndDate} onChange={handleChange} />
                            {error.expectedEndDate && <p>{error.expectedEndDate}</p>}
                        </div>
                        <div className="input-box">
                            <label> Start Date</label>
                            <input type="date" name="startDate" placeholder="Enter Start Date..." value={formData.startDate} onChange={handleChange} />
                            {error.startDate && <p>{error.startDate}</p>}
                        </div>
                        <div className="input-box">
                            <label> End Date</label>
                            <input type="date" name="endDate" placeholder="Enter End Date..." value={formData.endDate} onChange={handleChange} />
                            {error.endDate && <p>{error.endDate}</p>}
                        </div>
                        <button type="submit" className="btn">Add New Task</button>
                    </form>
                </div>
                </div>
            </>
            )
}

            export default TaskAdd;