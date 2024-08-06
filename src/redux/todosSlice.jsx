import { createSlice } from '@reduxjs/toolkit';

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
        task: action.payload.task,
        endDate: action.payload.endDate,
        completed: false,
        createdAt: new Date().toLocaleString(),
        modifiedAt: null,
      };
      state.push(newTodo);
      localStorage.setItem('todos', JSON.stringify(state));
    },
    editTodo: (state, action) => {
      const { id, task, endDate } = action.payload;
      const todo = state.find(todo => todo.id === id);
      if (todo) {
        todo.task = task;
        todo.endDate = endDate;
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
    completeAllTodos: (state) => {
      const updatedTodos = state.map(todo => ({ ...todo, completed: true }));
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    },
    uncompleteAllTodos: (state) => {
      const updatedTodos = state.map(todo => ({ ...todo, completed: false }));
      localStorage.setItem('todos', JSON.stringify(updatedTodos));
      return updatedTodos;
    },
    deleteAllTodos: () => {
      localStorage.removeItem('todos');
      return [];
    }
  },
});

export const { addTodo, editTodo, removeTodo, toggleComplete, loadTodos, completeAllTodos, uncompleteAllTodos, deleteAllTodos } = todosSlice.actions;

export default todosSlice.reducer;
