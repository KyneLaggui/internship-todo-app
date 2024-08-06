import { useState } from 'react';

const AddTodoModal = ({ onClose, onAdd }) => {
  const [newTodoText, setNewTodoText] = useState('');

  const handleAdd = () => {
    const newTodo = { id: Date.now(), text: newTodoText };
    onAdd(newTodo);
    onClose();
  };

  return (
    <div className="modal">
      <h2>Add Todo</h2>
      <input 
        type="text" 
        value={newTodoText} 
        onChange={(e) => setNewTodoText(e.target.value)} 
      />
      <button onClick={handleAdd}>Add</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default AddTodoModal;
