import { createSlice } from '@reduxjs/toolkit';

const loadTodosFromLocalStorage = () => {
  try {
    const serializedState = localStorage.getItem('todos');
    return serializedState ? JSON.parse(serializedState) : [];
  } catch (e) {
    return [];
  }
};

const initialState = loadTodosFromLocalStorage().map(todo => ({
  ...todo,
  tags: todo.tags || []
})) || [];

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
        tags: action.payload.tags || [], // Include tags
      };
      state.push(newTodo);
      localStorage.setItem('todos', JSON.stringify(state));
    },
    editTodo: (state, action) => {
      const { id, task, endDate, tags } = action.payload;
      const todo = state.find(todo => todo.id === id);
      if (todo) {
        todo.task = task;
        todo.endDate = endDate;
        todo.modifiedAt = new Date().toLocaleString();
        todo.tags = tags || []; // Update tags
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
    completeAllTodos(state, action) {
      const ids = action.payload; 
      const currentDate = new Date();
      state.forEach(todo => {
        if (ids.includes(todo.id) && new Date(todo.endDate) >= currentDate) {
          todo.completed = true; 
        }
      });
    },
    uncompleteAllTodos(state, action) {
      const ids = action.payload;
      const currentDate = new Date();
      state.forEach(todo => {
        if (ids.includes(todo.id) && new Date(todo.endDate) >= currentDate) {
          todo.completed = false; 
        }
      });
    },
    deleteAllTodos: () => {
      localStorage.removeItem('todos');
      return [];
    }
  },
});

export const { addTodo, editTodo, removeTodo, toggleComplete, loadTodos, completeAllTodos, uncompleteAllTodos, deleteAllTodos } = todosSlice.actions;

export default todosSlice.reducer;