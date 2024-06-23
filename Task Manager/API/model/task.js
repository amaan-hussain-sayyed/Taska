let { Task } = require("../schema/Task")
let { User } = require("../schema/user")
let joi = require("joi");
let { validate } = require("../helper/validation");
let { QueryTypes, sequelizeCon } = require("../init/dbConfig");
let { sendMail } = require("../helper/mailer");
let config = require("config");
let mailCredential = config.get("mailCredential");
let statusChange = config.get("statusCode")



// WHAT TO DO:->We Have To Create New Task
// INPUT:->TaskName,TaskDescription,ExpectedStartDate,ExpectedEndDate
// OUTPUT:->Task Created Successfully

async function createTask(params, userData) {
    // UserData Validation
    let schema = joi.object({
        taskName: joi.string().min(5).max(155).required(),
        taskDescription: joi.string().min(15).max(500).required(),
        expectedStartDate: joi.date().iso(),
        expectedEndDate: joi.date().iso(),
        startDate: joi.date().iso(),
        endDate: joi.date().iso()
    })

    let check = await validate(schema, params).catch((error) => {
        return { error }
    })
    console.log("check", check);
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // Data Formatting
    let data = {
        name: params.taskName,
        description: params.taskDescription,
        expectedEndDate: params.expectedEndDate,
        expectedStartDate: params.expectedStartDate,
        createdBy: userData.id,
        updatedBy: userData.id
    }

    // Inserting Data into DB
    let insert = await Task.create(data).catch((error) => {
        return { error }
    })
    console.log("task insert", insert);

    if (!insert || (insert && insert.error)) {
        return { errror: "Task Not Created", status: 500 }
    }

    // return Response
    return { data: { id: insert.id } }
}

// WHAT TO DO:->We Have To Update Task
// INPUT:->TaskID,TaskName,TaskDescription,ExpectedStartDate,ExpectedEndDate,StartDate,EndDate
// OUTPUT:->Task Has been Updated Successfully

async function update(taskId, params, userData) {
    // User Data Validation
    let schema = joi.object({
        id: joi.number().required(),
        taskName: joi.string().min(5).max(155),
        taskDescription: joi.string().min(15).max(500),
        expectedStartDate: joi.date(),
        expectedEndDate: joi.date(),
        startDate: joi.date(),
        endDate: joi.date(),
    })
    let joiParams = { ...params };
    joiParams["id"] = taskId

    let check = await validate(schema, joiParams).catch((error) => {
        return { error }
    })
    console.log("Check", check);
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // Check if Task Exists
    let task = await Task.findOne({ where: { id: taskId, isDeleted: false } }).catch((error) => {
        return { error }
    })
    if (!task || (task && task.error)) {
        return { error: "Task Not Found", status: 404 }
    }
    // Check if task is Created by the user
    if (userData.id != task.createdBy) {
        return { error: "Access Denied ", status: 403 }
    }
    // Data Formatting
    let data = {}
    if (params.taskName) { data["name"] = params.taskName }
    if (params.taskDescription) { data["description"] = params.taskDescription }
    if (params.startDate) { data["startDate"] = params.startDate }
    if (params.endDate) { data["endDate"] = params.endDate }
    if (params.expectedStartDate) { data["expectedStartDate"] = params.expectedStartDate }
    if (params.expectedEndDate) { data["expectedEndDate"] = params.expectedEndDate }



    // Update in Database
    let update = await Task.update(data, { where: { id: taskId } }).catch((error) => {
        return { error }
    })
    console.log("update", update);

    if (!update || (update && update.error)) {
        return { error: "Task Could Not Update", status: 500 }
    }
    // Return Response
    return { data: update }

}

// WHAT TO DO:->We Have To Show Task List
// INPUT:-> Login User Token
// OUTPUT:->Task List Of Individual User

async function list(params, userData) {
    // Create the SQL query
    let query = `SELECT task.id, task.name AS taskName, user.name AS createdBy
    FROM task
    LEFT JOIN user ON task.createdBy = user.id
    WHERE task.isDeleted = false AND (task.createdBy = :userID OR task.assignTo = :userID)
`;
    if (params.taskName) {
        query += ` AND task.name LIKE '%${params.taskName}%'`;
    }

    // Fetch data from table
    let list = await sequelizeCon.query(query, {
        type: QueryTypes.SELECT,
        replacements: { userID: userData.id }
    }).catch((error) => {
        return { error };
    });
    if (!list || (list && list.error)) {
        return { error: "Task Not Found", status: 404 };
    }

    // Return Response
    return { data: list };
}


// WHAT TO DO:->We Have To Show Task Detail of Individual Task
// INPUT:-> Login User Token, TaskID
// OUTPUT:->Task Detail Of Individual Task

async function detail(taskId, userData) {
    // UserData Validation
    let schema = joi.object({
        id: joi.number().required()
    })
    let joiParams = {}
    joiParams["id"] = taskId;
    let check = await validate(schema, joiParams).catch((error) => {
        return { error }
    })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // Create the Sql Query
    let query = `SELECT task.name AS taskName,task.description AS taskdescription,startDate,endDate,expectedStartDate,expectedEndDate, u1.name AS createdBy,u2.name AS updatedBy,u3.name AS assignTo
    FROM task
    LEFT JOIN user AS u1 ON task.createdBy = u1.id
    LEFT JOIN user AS u2 ON task.updatedBy = u2.id
    LEFT JOIN user AS u3 ON task.assignTo = u3.id
    Where task.id= :taskID and (task.createdBy= :userID or task.assignTo= :userID) LIMIT 1`

    // Fetch Data From DataBase
    let detail = await sequelizeCon.query(query, {
        type: QueryTypes.SELECT,
        replacements: { taskID: taskId, userID: userData.id }
    }).catch((error) => {
        return { error }
    })
    console.log("Details", detail);

    if (!detail || (detail && detail.error)) {
        return { error: "Task Detail Cannot Found", status: 404 }
    }
    if (detail.length <= 0) {
        return { error: "Record Not Found", status: 404 }
    }
    // Return Response
    return { data: detail[0] }
}

// WHAT TO DO:->We Have To Assign Task to Other Login User
// INPUT:->TaskID which is assiging & UserID to whom we assigning the task
// OUTPUT:->Mail will sent to Assign person

async function assignTo(taskId, params, userData) {
    console.log("params", params);
    // UserData Validation 
    let schema = joi.object({
        userEmail: joi.string().email().required(),
        id: joi.number().required(),
    })
    let joiParams = { ...params }
    joiParams["id"] = taskId
    let check = await validate(schema, joiParams).catch((error) => {
        return { error }
    })
    console.log("check", check);
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }

    // Check if Task Exist

    let checkTask = await Task.findOne({ where: { id: taskId } }).catch((error) => {
        return { error }
    })

    if (!checkTask || (checkTask && checkTask.error)) {
        return { error: "Task Not Found", status: 404 }
    }

    // Check if Task Belongs to Login User

    if (userData.id !== checkTask.createdBy) {
        return { error: "You are not authorized to assign this task to another user", status: 403 };
    }

    // check if task id not deleted or disable

    if (checkTask.isDeleted == true || checkTask.isActive == false) {
        return { error: "Task is Not Available", status: 403 }
    }

    // Check if User Exist
    let assignUser = await User.findOne({ where: { emailID: joiParams.userEmail, isDeleted: false, isActive: true } }).catch((error) => {
        return { error }
    })
    // console.log("assignUser", assignUser);

    if (!assignUser || (assignUser && assignUser.error)) {
        return { error: "User Not Found", status: 404 }
    }
    // Data Format
    let data = {
        status: 2,
        updatedBy: userData.id,
        assignTo: joiParams.userEmail
    }
    // Update Data into Database
    let update = await Task.update(data, { where: { id: taskId } }).catch((error) => {
        return { error }
    })
    console.log("update", update);

    if (!update || (update && update.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    // Mail Format

    let mailOption = {
        to: assignUser.emailID,
        from: mailCredential.user,
        subject: " Task Assigned ",
        text: `Task "${checkTask.name}" has been assigned to you by ${userData.name} Task Description: ${checkTask.description}`
    }

    // Send Mail
    let mail = await sendMail(mailOption).catch((error) => {
        return { error }
    })
    if (!mail || (mail && mail.error)) {
        return { error: "Not Able To Send Assiging Task!", status: 500 }
    }
    // Return Respone
    return { data: update }
}

// WHAT TO DO:->We Have To Delete Task
// INPUT:->TaskID
// OUTPUT:->Task Has Been Deleted Successfully

async function deleteTask(taskId, params, userData) {
    // UserData Validation
    let schema = joi.object({
        id: joi.number().required()
    })
    let joiParams = { ...params }
    joiParams["id"] = taskId
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
    // Check if Task Belongs to login User
    if (userData.id != task.createdBy) {
        return { error: "You are not authorized to Delete this Task", status: 403 }
    }
    // Check if Task is Not Deleted 
    if (task.isActive == false || task.isDeleted == true) {
        return { error: "Task is Not Available", status: 403 }
    }
    // Data Format
    let data = {
        isDeleted: true,
        updatedBy: userData.id

    }
    // Update Data in DataBase
    let update = await Task.update(data, { where: { id: taskId } }).catch((error) => {
        return { error }
    })
    console.log("update", update);
    if (!update || (update && update.error)) {
        return { error: "Internal Server Error", status: 500 }
    }

    // Return Response
    return { data: update }
}

// WHAT TO DO:->We Have To Restore the Deleted Task
// INPUT:->TaskID
// OUTPUT:->Task Has Been Restored Successfully

async function restoreTask(taskId, params, userData) {
    // UserData Validation 
    let schema = joi.object({
        id: joi.number().required()
    })
    let joiParams = { ...params }
    joiParams["id"] = taskId

    let check = await validate(schema, joiParams).catch((error) => {
        return { error }
    })
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // check if task exist
    let task = await Task.findOne({ where: { id: taskId } }).catch((error) => {
        return { error }
    })
    if (!task || (task && task.error)) {
        return { error: "Task Not Found", status: 404 }
    }
    // check if task belongs to login user 
    if (userData.id !== task.createdBy) {
        return { error: "You are not authorized to Delete this Task", status: 403 }
    }
    // Check if Task is Not Deleted 
    if (task.isDeleted = false) {
        return { error: "Task is Already Active", status: 409 }
    }
    // Data Formatting
    let data = {
        isDeleted: false,
        updatedBy: userData.id

    }
    // Update in DB
    let update = await Task.update(data, { where: { id: taskId } }).catch((error) => {
        return { error }
    })
    if (!update || (update && update.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    // Return Response
    return { data: update }
}

// WHAT TO DO:->We Have To Show the Task Status
// INPUT:->Status Code
// OUTPUT:->Show the Task Status

async function taskStatus(taskId, params, userData) {
    // UserData Validation
    let schema = joi.object({
        id: joi.number().required(),
        statusCode: joi.number().required()
    })
    let joiParams = { ...params }
    joiParams["id"] = taskId
    let check = await validate(schema, joiParams).catch((error) => {
        return { error }
    })
    console.log("Status check", check);
    if (!check || (check && check.error)) {
        return { error: check.error, status: 400 }
    }
    // Check if Task Exist
    let task = await Task.findOne({ where: { id: taskId } }).catch((error) => {
        return { error }
    })
    console.log("Status task", task);
    if (!task || (task && task.error)) {
        return { error: "Task Not Found", status: 404 }
    }
    // Check if Task is Assigned to Login User
    if (task.createdBy != userData.id && task.assignTo != userData.id) {
        return { error: "You are not authorized to assigned this Task", status: 403 }
    }
    // Check if Task is  Not Deleted
    if (task.isDeleted == true || task.isActive == false) {
        return { error: "Task is Not Available", status: 403 }
    }
    // Check if StatusCode is Valid 
    if (statusChange[params.statusCode] == undefined) {
        return { error: "Invalid Status Code", status: 422 }
    }
    // Data Formating
    let data = {
        statusCode: params.statusCode,
        updatedBy: userData.id
    }
    console.log("api Data", data);
    // Update Data in DataBase
    let update = await Task.update(data, { where: { id: taskId } }).catch((error) => {
        return { error }
    })
    console.log("status UPdate", update);
    if (!update || (update && update.error)) {
        return { error: "Internal Server Error", status: 500 }
    }
    // Return Response
    return { message: ` Status Of The Task Has Been ${statusChange[params.statusCode]} Successfully` };
}
module.exports = { createTask, update, list, detail, assignTo, deleteTask, restoreTask, taskStatus }


