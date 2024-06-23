import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./authSlice"
import taskSlice from "./taskSlice"
import taskCommentSlice from "./taskCommentSlice";

const store=configureStore({
    reducer:{
        auth:authSlice,
        task:taskSlice,
        taskComment:taskCommentSlice
        
        // Cart:
        // Product:    We Can All These Things Also As per Project Requirement
        // Category"
    }
})

export default store;