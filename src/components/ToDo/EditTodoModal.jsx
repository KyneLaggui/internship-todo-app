import { useState } from 'react';

const EditTodoModal = ({ todo, onClose, onEdit }) => {
  const [editedTodoText, setEditedTodoText] = useState(todo.text);

  const handleEdit = () => {
    const updatedTodo = { ...todo, text: editedTodoText };
    onEdit(updatedTodo);
    onClose();
  };

  return (
    <div className="modal">
      <h2>Edit Todo</h2>
      <input 
        type="text" 
        value={editedTodoText} 
        onChange={(e) => setEditedTodoText(e.target.value)} 
      />
      <button onClick={handleEdit}>Save</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default EditTodoModal;
