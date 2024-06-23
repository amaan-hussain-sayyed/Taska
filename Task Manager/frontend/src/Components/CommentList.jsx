import { useParams } from "react-router-dom";
import { TaskCommentList } from "../Services/taskCommentService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setList } from "../Store/taskCommentSlice";

function CommentList(){
    let {id}=useParams()
    const list=useSelector(state=>{return state.taskComment.list})
    const dispatch=useDispatch()

    useEffect(()=>{
        getList()
    },[])

    async function getList(){
        let data=await TaskCommentList(id).catch((error)=>{
            return {error}
        })
        if(data.error){
            return alert(data.error)
        }
        dispatch(setList(data))
    }
    return (
        <>
        <div className="Comment col-sm-12">
        <h4>Comment List</h4>
        {
            list && list.map((item,index)=>{
                return (
                    <p key={index}>{item.comments}</p>
                )
            })
        }

        </div>
        </>
    )
}

export default CommentList;