import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../redux/todosSlice';

const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export default store;