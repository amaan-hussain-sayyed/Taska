import { useState } from "react";
import { validator } from "../Utils/project";
import * as yup from "yup";
import { AddComment } from "../Services/taskCommentService"
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addTaskComment } from "../Store/taskCommentSlice";


function CommentAdd() {
    let { id } = useParams()
    let initialVal = {taskComment:""}
    const [comment, setComment] = useState(initialVal)
    const [error, setError] = useState("")
    let dispatch = useDispatch()

    async function handleSubmit(e) {
        e.preventDefault()
        let schema = yup.object({
            taskComment: yup.string().min(5).max(450).required()
        })
        let check = await validator(schema, comment).catch((error) => {
            return { error }
        })
        console.log("check comment", check);

        if (check.error) {
            return setError(check.error)
        }

        let data = await AddComment(id, comment).catch((error) => {
            return { error }
        })
        console.log("data comment", data);

        if (data.error) {
            return setError(data.error)
        }
        dispatch(addTaskComment(data))
        setComment(initialVal)
        setError("")

    }


    function handleChange(e) {
        let tempData = { ...comment }
        tempData[e.target.name] = e.target.value
        setComment(tempData)
    }


    return (
        <>
         <div className="Comment-form">
  <form className="row" onSubmit={handleSubmit}>
    <div className="col-sm-10"> 
      <input 
        type="text" 
        className="form-control" 
        name="taskComment" 
        placeholder="Enter Your Comment..." 
        value={comment.taskComment} 
        onChange={handleChange} 
      />
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
    <div className="col-sm-2">
      <button className="btn btn-primary" type="submit">ADD COMMENT</button>
    </div>
  </form>
</div>

        </>
    )
}



export default CommentAdd;