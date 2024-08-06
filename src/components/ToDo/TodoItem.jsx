const TodoItem = ({ todo, onEdit }) => {
  return (
    <div className="todo-item">
      <span>{todo.text}</span>
      <button onClick={onEdit}>Edit</button>
    </div>
  );
};

export default TodoItem;
