import CommentAdd from "../Components/CommentAdd";
import CommentList from "../Components/CommentList";
import TaskCard from "../Components/TaskCard";
import AssignTo from "../Components/AssignTo"
import { useState } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import TaskStatus from "../Components/TaskStatus";

function TaskDetails() {
    const [key, setKey] = useState("home");

    return (
        <div className="d-flex flex-col">
            <div className="Task-Details col-sm-6 float-left">
                <h4>Task Details</h4>
                <TaskCard />      
            </div>
            <div className="Comment-Container col-sm-6 float-right">
                <Tabs
                    id="controlled-tab-example"
                    activeKey={key}
                    onSelect={(k) => setKey(k)}
                    className="mb-3"
                >
                    <Tab eventKey="home" title="Comment">
                        <CommentList />
                        <CommentAdd />
                    </Tab>
                    <Tab eventKey="profile" title="Assign Task">
                        <AssignTo />
                    </Tab>
                    <Tab eventKey="contact" title="Status">
                    <TaskStatus/>
                    </Tab>
                </Tabs>
            </div>
        </div>
    );
}

export default TaskDetails;