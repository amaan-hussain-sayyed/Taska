import { useDispatch, useSelector } from "react-redux";
import { taskDelete, taskList } from "../Services/taskService";
import { useEffect } from "react";
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { setLoading, setError, setTask, deleteTask } from '../Store/taskSlice'
import { useNavigate } from "react-router-dom";
import "../style.css"

function TaskList() {
    let list = useSelector(state => { return state.task.list })
    let loading = useSelector(state => { return state.task.isLoading })
    let error = useSelector(state => { return state.task.error })
    let navigate = useNavigate()
    let dispatch = useDispatch()

    useEffect(() => {
        getList()
    }, [])


    async function getList() {
        dispatch(setLoading(true))
        let data = await taskList().catch((error) => {
            return { error }
        })
        if (data.error) {
            return dispatch(setError("Failed to fetch Data"))
        }
        dispatch(setLoading(false))
        dispatch(setTask(data.data))

    }

    function handleDetails(task) {
        navigate(`/task/${task.id}`)
    }
    function handleUpdate(task) {
        navigate(`/task/update/${task.id}`)

    }
    async function handleRemove(task) {
        let data = await taskDelete(task.id).catch((error)=>{
            return {error}
        })
        if (data.error) {
            dispatch(setError("Failed to delete task"));
        }
        dispatch(setLoading(false))
        dispatch(deleteTask(task.id))
    }
    return (
        <>
            <div className="Task-List">
                {loading && (
                    <div>
                        <Button variant="primary" disabled>
                            <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            Loading...
                        </Button>
                    </div>
                )}
                {error && <div className="col-12">{error}</div>}
                {
                    (list && !loading && !error) && list.map((item, index) => {
                        return (
                            <div className="Task-Item" key={index}>
                                <h4>
                                    {item.taskName}
                                    <Button variant="outline-danger" onClick={() => { handleRemove(item) }}>Remove</Button>{' '}
                                    <Button variant="outline-success" onClick={() => { handleUpdate(item) }}> Update </Button>{' '}
                                    <Button variant="outline-primary" onClick={() => { handleDetails(item) }}> Details </Button>{' '}
                                </h4>
                            </div>
                        );
                    })}
            </div>
        </>
    );
}

export default TaskList;
