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
      const newTodo = {
        id: Date.now(),
        task: action.payload,
        completed: false,
        createdAt: new Date().toLocaleString(),
        modifiedAt: null,
      };
      state.push(newTodo);
      localStorage.setItem('todos', JSON.stringify(state)); 
    },
    editTodo: (state, action) => {
      const { id, task } = action.payload;
      const todo = state.find(todo => todo.id === id);
      if (todo) {
        todo.task = task;
        todo.modifiedAt = new Date().toLocaleString();
        localStorage.setItem('todos', JSON.stringify(state));
      }
    },
    removeTodo: (state, action) => {
      const updatedTodos = state.filter(todo => todo.id !== action.payload);
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    },
    toggleComplete: (state, action) => {
      const todo = state.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos', JSON.stringify(state)); 
      }
    },
    loadTodos: (state, action) => {
      return action.payload; 
    },
  },
});

export const { addTodo, editTodo, removeTodo, toggleComplete, loadTodos } = todosSlice.actions;

export default todosSlice.reducer;
