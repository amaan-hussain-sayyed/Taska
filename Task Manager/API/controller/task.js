let task = require("../model/task")


async function createTask(req, res) {
    let data = await task.createTask(req.body, req.userData).catch((error) => {
        return { error }
    })
    console.log("taskData", data);
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}

async function updateTask(req, res) {
    let data = await task.update(req.params.taskId, req.body, req.userData).catch((error) => {
        return { error }
    })
    console.log("data", data);

    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}

async function listTask(req, res) {
    let data = await task.list(req.query,req.userData).catch((error) => {
        return { error }
    })
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}

async function detailTask(req, res) {
    let data = await task.detail(req.params.taskId, req.userData).catch((error) => {
        return { error }
    })
    console.log("Data COntroller",data);
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}
async function assignTo(req, res) {
    let data = await task.assignTo(req.params.taskId,req.body, req.userData).catch((error) => {
        return { error }
    })
    console.log("assignTODAta",data);
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ data: "Task Assigned Successfully" })
}

async function deleteTask(req, res) {
    let data = await task.deleteTask(req.params.taskId, req.body, req.userData).catch((error) => {
        return { error }
    })
    console.log("data", data);

    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ data: "Task Deleted Successfully" })
}
async function restoreTask(req, res) {
    let data = await task.restoreTask(req.params.taskId, req.body, req.userData).catch((error) => {
        return { error }
    })
    console.log("data", data);

    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({ data: "Task Restored Successfully" })
}

async function taskStatus(req, res) {
    let data = await task.taskStatus(req.params.taskId, req.body, req.userData).catch((error) => {
        return { error }
    })
    console.log("data status",data);
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error";
        let status = (data && data.status) ? data.status : 500;
        return res.status(status).send({ error })
    }
    return res.send({data})
}

module.exports = { createTask, updateTask, listTask, detailTask, assignTo, deleteTask, restoreTask,taskStatus };
