import { useParams, useSearchParams } from "react-router-dom";
import { singleTaskDetails } from "../Services/taskService";
import { useState, useEffect } from "react";
import Table from 'react-bootstrap/Table';



function TaskCard() {
    let { id } = useParams();
    // const[searchParams,setSearchParams]=useSearchParams();
    // console.log(searchParams.get("name"),searchParams.get("page"));
    const [taskData, setTaskData] = useState({})
    const[error,setError]=useState(null)

    useEffect(() => {
        getTask()
    }, [])

    async function getTask() {
        let data = await singleTaskDetails(id).catch((error) => {
            return { error }
        })
        if (data.error) {
            return setError("Error fetching task details. Please try again later.");
        }
        setTaskData(data)
    }


    return (
        <>
           <div className="table col-sm-12">
           <Table striped bordered hover variant="light">
                <tbody>
                    {error &&<tr><td>{error}</td></tr>}
                    {
                        (!error && taskData) && Object.keys(taskData).map((key, index) => {
                            return (
                                <tr key={index}>
                                    <td>{key}</td>
                                    <td>{taskData[key]}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>
           </div>
        </>
    )
}




export default TaskCard;

