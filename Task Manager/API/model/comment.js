let { TaskComment } = require("../schema/taskComment")
let { Task } = require("../schema/Task")
let joi = require("joi")
let { validate } = require("../helper/validation")

// WHAT TO DO:->We have create a Comment table but only a person who is created the task or assign person can comment on that Task
// INPUT:->TaskID & Comment
// OUTPUT:->Success

async function taskComment(taskId, params, userData) {
    // User Data Validation
    let schema = joi.object({
        id: joi.number().required(),
        taskComment: joi.string().min(5).max(450).required()
    })
    let joiParams = { ...params };
    joiParams["id"] = taskId;
    let check = await validate(schema, joiParams).catch((error) => {
        return { error }
    })
    console.log("check", check);

    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // Check if Task Exist 
    let task = await Task.findOne({ where: { id: taskId } }).catch((error) => {
        return { error }
    })
    console.log("task", task);

    if (!task || (task && task.error)) {
        return { error: "Task Not Found", status: 404 }
    }
    // Check if Task is Assign to Or CreatedBy User
    if (userData.id != task.createdBy && userData.id != task.assignTo) {
        return { error: "You are not authorized to Comment on this Task", status: 403 }
    }
    // Check if task is Not Deleted 
    if (task.isDeleted == true) {
        return { error: "Task is Deleted You Cannot Comment", status: 403 }
    }
    // Check if Task is Active 
    if (task.isActive == false) {
        return { error: "Task is Currently Not Available", status: 403 }
    }
    // Data Formatting
    let data = {
        comments: params.taskComment,
        taskID: taskId ,
        createdBy: userData.id
    }
    // Insert Data into DB
    let insert = await TaskComment.create(data).catch((error) => {
        return { error }
    })
    console.log("insert", insert);

    if (!insert || (insert && insert.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    // Return Response
    return { data: insert }
}

// WHAT TO DO:->We have show Comment List 
// INPUT:->TOken
// OUTPUT:->ALL Comments Related to Token

async function commentList(taskId) {
    // UserData Validation
    let schema = joi.object({
        id: joi.number().required()
    })
    let joiParams = {}
    joiParams["id"] = taskId
    console.log("joiparams", joiParams);
    console.log("schema", schema);

    let check = await validate(schema, joiParams).catch((error) => {
        return { error }
    })
    console.log("check", check);

    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // Check if Comment Exist 
    let list = await TaskComment.findAll({where:{taskID:taskId}}).catch((error) => {
        return { error }
    })
    console.log("list", list);

    if (!list || (list && list.error)) {
        return { error: "Comment Cannot Find", status: 404 }
    }
    // Return Respone
    return { data: list }
}

module.exports = { taskComment, commentList }