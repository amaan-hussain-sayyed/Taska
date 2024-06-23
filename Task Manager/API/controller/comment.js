let comment = require("../model/comment")

async function taskComment(req, res) {
    let data = await comment.taskComment(req.params.taskId,req.body, req.userData).catch((error) => {
        return { error }
    })
    console.log("Comment data",data);
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "Internal Server Error"
        let status = (data && data.status) ? data.status : 500
        return res.status(status).send({ error })
    }
    return res.send({ data: data.data })
}

async function commentList(req,res){
    let data=await comment.commentList(req.params.taskId).catch((error)=>{
        return {error}
    })
    console.log("data",data);
    if(!data || (data && data.error)){
        let error= (data && data.error) ? data.error :"Internal Server Error"
        let status= (data && data.status) ? data.status : 500
        return res.status(status).send({error})
    }
    return res.send({data:data.data})
}

module.exports={taskComment,commentList}