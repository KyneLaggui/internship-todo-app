import { createSlice } from "@reduxjs/toolkit";

const initialState = []

const todosSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        addTodo: (state, action) => {
            state.push({ id: Date.now(), task: action.payload });
        },
        editTodo: (state, action) => {
            const { id, task } = action.payload;
            const todo = state.find(todo => todo.id === id);
            if (todo) {
                todo.task = task;
            }
        },
        removeTodo: (state, action) => {
            return state.filter(todo => todo.id !== action.payload);
        },
    }
})

export const { addTodo, editTodo, removeTodo } = todosSlice.actions;

export default todosSlice.reducer;