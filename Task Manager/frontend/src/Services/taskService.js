
let baseUrl = "http://localhost:3150/";


async function addTask(details) {
    let options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "token": JSON.parse(localStorage.getItem("userInfo")).token
        },
        body: JSON.stringify(details)
    }
    let response = await fetch(baseUrl + 'Task', options).catch((error) => {
        return { error }
    })
    console.log("response", response);
    console.log("details", details);

    if (response.error) {
        return { error: response.error }
    }
    let data = await response.json().catch((error) => {
        return { error }
    })
    console.log("data", data);

    if (data.error) {
        return { error: data.error }
    }
    return data.data;
}

async function taskList(search) {
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": JSON.parse(localStorage.getItem("userInfo")).token
        }
    }
    let url = search ? baseUrl + 'Task?taskName=' + search : baseUrl + 'Task';
    let response = await fetch(url, options).catch((error) => {
        return { error }
    })
    if (response.error) {
        return { error: response.error }
    }
    let data = await response.json().catch((error) => {
        return { error }
    })
    if (data.error) {
        return { error: data.error }
    }
    return data;
}

async function singleTaskDetails(id) {
    let options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token": JSON.parse(localStorage.getItem("userInfo")).token
        }
    }
    let response = await fetch(baseUrl + 'Task/' + id, options).catch((error) => {
        return { error }
    })
    if (response.error) {
        return { error: response.error }
    }
    let data = await response.json().catch((error) => {
        return { error }
    })
    if (data.error) {
        return { error: data.error }
    }
    return data.data
}

async function taskEdit(taskDetails, id) {
    let options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": JSON.parse(localStorage.getItem("userInfo")).token
        },
        body: JSON.stringify(taskDetails)
    }
    let response = await fetch(baseUrl + 'Task/' + id, options).catch((error) => {
        return { error }
    })
    if (response.error) {
        return { error: response.error }
    }
    let data = await response.json().catch((error) => {
        return { error }
    })
    console.log("Api data", data);
    if (data.error) {
        return { error: data.error }
    }
    return data
}

async function taskDelete(id) {
    let options = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "token": JSON.parse(localStorage.getItem("userInfo")).token
        }
    }
    let response = await fetch(baseUrl + 'Task/' + id, options).catch((error) => {
        return { error }
    })
    if (response.error) {
        return { error: response.error }
    }
    let data = await response.json().catch((error) => {
        return { error }
    })
    if (data.error) {
        return { error: data.error }
    }
    return data
}

async function assignTo(taskId,userData) {
    let options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": JSON.parse(localStorage.getItem("userInfo")).token
        },
        body: JSON.stringify(userData)
    }
    let response = await fetch(baseUrl + 'Task/assignTo/'+taskId ,options).catch((error) => {
        return { error }
    })
    console.log("service response", response);
    console.log("response Body",body);

    if (response.error) {
        return { error: response.error }
    }
    let data = await response.json().catch((error) => {
        return { error }
    })
    console.log("service data", data);

    if (data.error) {
        return { error: data.error }
    }
    return data.data;
}

async function taskStatus(id, userData) {
    console.log("UserData",userData);
    let options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": JSON.parse(localStorage.getItem("userInfo")).token
        },
        body: JSON.stringify(userData)
    }
    let response = await fetch(baseUrl + 'Task/Status/' + id, options).catch((error) => {
        return { error }
    })
    console.log("response",response);
    if (response.error) {
        return { error:"Failed to update task status" }
    }
    let data = await response.json().catch((error) => {
        return { error }
    })
    console.log("response data",data);
    if (data.error) {
        return { error: data.error }
    }
    return data;
}

async function taskRestore(id) {
    let options = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "token": JSON.parse(localStorage.getItem("userInfo")).token
        }
    }
    let response = await fetch(baseUrl + 'RestoreTask/' + id, options).catch((error) => {
        return { error }
    })
    if (response.error) {
        return { error: response.error }
    }
    let data = await response.json().catch((error) => {
        return { error }
    })
    if (data.error) {
        return { error: data.error }
    }
    return data;

}

export { taskList, singleTaskDetails, taskEdit, addTask, taskDelete, assignTo, taskStatus, taskRestore }