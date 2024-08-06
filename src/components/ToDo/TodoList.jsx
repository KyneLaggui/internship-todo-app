import React, { useState } from 'react';
import TodoItem from './TodoItem';
import AddTodoModal from './AddTodoModal';
import EditTodoModal from './EditTodoModal';
import './TodoList.css';

const TodoList = ({ filter, sortOption, selectedTag }) => {
  const [todos, setTodos] = useState([]);
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);

  const addTodo = (newTodo) => {
    setTodos([...todos, newTodo]);
  };

  const editTodo = (updatedTodo) => {
    const updatedTodos = todos.map((todo) => 
      todo.id === updatedTodo.id ? updatedTodo : todo
    );
    setTodos(updatedTodos);
  };

  // Function to filter todos based on the selected tag
  const filteredTodos = todos.filter((todo) => {
    if (filter === 'All') return true;
    return todo.tag === selectedTag; // Modify this logic based on your tag implementation
  });

  // Function to sort todos based on the selected option
  const sortedTodos = filteredTodos.sort((a, b) => {
    if (sortOption === 'default') return 0;
    if (sortOption === 'asc') return a.text.localeCompare(b.text);
    if (sortOption === 'desc') return b.text.localeCompare(a.text);
    return 0;
  });

  return (
    <div className="todo-list">
      <button onClick={() => setAddModalOpen(true)}>Add Todo</button>

      {sortedTodos.map((todo) => (
        <TodoItem 
          key={todo.id} 
          todo={todo} 
          onEdit={() => {
            setEditingTodo(todo);
            setEditModalOpen(true);
          }} 
        />
      ))}
      {isAddModalOpen && (
        <AddTodoModal 
          onClose={() => setAddModalOpen(false)} 
          onAdd={addTodo} 
        />
      )}
      {isEditModalOpen && (
        <EditTodoModal 
          todo={editingTodo} 
          onClose={() => setEditModalOpen(false)} 
          onEdit={editTodo} 
        />
      )}
    </div>
  );
};

export default TodoList;
