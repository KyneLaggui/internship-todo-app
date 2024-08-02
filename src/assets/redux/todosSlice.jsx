import { createSlice } from '@reduxjs/toolkit';

// Load initial state from local storage
const loadTodosFromLocalStorage = () => {
  const savedTodos = localStorage.getItem('todos');
  return savedTodos ? JSON.parse(savedTodos) : [];
};

const initialState = loadTodosFromLocalStorage();

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action) => {
      const newTodo = { id: Date.now(), task: action.payload, completed: false };
      state.push(newTodo);
      localStorage.setItem('todos', JSON.stringify(state)); // Save to local storage
    },
    editTodo: (state, action) => {
      const { id, task } = action.payload;
      const todo = state.find(todo => todo.id === id);
      if (todo) {
        todo.task = task;
        localStorage.setItem('todos', JSON.stringify(state)); // Save to local storage
      }
    },
    removeTodo: (state, action) => {
      const updatedTodos = state.filter(todo => todo.id !== action.payload);
      localStorage.setItem('todos', JSON.stringify(updatedTodos)); // Save to local storage
      return updatedTodos;
    },
    toggleComplete: (state, action) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos', JSON.stringify(state)); // Save to local storage
      }
    },
  },
});

export const { addTodo, editTodo, removeTodo, toggleComplete } = todosSlice.actions;

export default todosSlice.reducer;
