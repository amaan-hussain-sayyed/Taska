import { createSlice } from "@reduxjs/toolkit";

const initialState={
    list:[]
}

const TaskCommentSlice=createSlice({
    name:"taskComment",
    initialState,
    reducers:{
        setList:(state,action)=>{
            state.list=action.payload

        },
        addTaskComment:(state,action)=>{
            state.list.push(action.payload)
            console.log("sliceTask",action.payload);
        },
    },

})

export const {setList,addTaskComment}=TaskCommentSlice.actions
export default TaskCommentSlice.reducer;