import { taskList } from "../Services/taskService";
import { useState } from "react";
import { useDispatch } from 'react-redux'
import { setTask } from '../Store/taskSlice'
import { setLoading, setError } from '../Store/taskSlice'
import "../style.css"
import "../responsive.css"



function TaskSearch() {
    let [search, setSearch] = useState("");
    let dispatch = useDispatch()


    async function handleSubmit(e) {
        e.preventDefault()
        dispatch(setLoading(true))
        let data = await taskList(search).catch((error) => {
            return { error }
        })
        if (data.error) {
            return dispatch(setError("Failed to fetch Data"))
        }
        dispatch(setLoading(false))
        dispatch(setTask(data.data))
    }

    function handleChange(e) {
        setSearch(e.target.value);
    }

    return (
        <>
            <div className="search-tab">
                <form className="row" onSubmit={handleSubmit}>
                    <div className="col-sm-8">
                        <input type="text" className="form-control" name="search" onChange={handleChange} placeholder="Search Task..." />
                    </div>
                    <div className="col-sm-4">
                        <button className="btn btn-primary" type="submit">Search</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default TaskSearch;