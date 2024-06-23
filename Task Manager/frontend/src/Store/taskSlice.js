import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    list: [],
    isLoading: false,
    error: null

}

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.isLoading = action.payload
            state.error = false
        },
        setTask: (state, action) => {
            state.list = action.payload
            state.isLoading = false
            state.error = false
        },
        updateTask: (state, action) => {
            for (let i in state.list) {
                let obj = state.list[i];
                if (obj["id"] = action.payload.id) {
                    state.list[i] = action.payload
                }

            }
        },
        setError: (state, action) => {
            state.error = action.payload
            state.isLoading = false
        },
        deleteTask: (state, action) => {
            state.list = state.list.filter(task => task.id !== action.payload);
        }
    }
})

export const { setLoading, setTask, setError, updateTask,deleteTask } = taskSlice.actions;
export default taskSlice.reducer