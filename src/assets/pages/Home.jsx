import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, editTodo, removeTodo, toggleComplete } from '../redux/todosSlice';


const Home = () => {
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [show, setShow] = useState(false);

  const handleAddTodo = () => {
    if (newTask.trim()) {
      dispatch(addTodo(newTask));
      setNewTask('');
    }
  };

  const handleEditTodo = (id, task) => {
    setEditId(id);
    setEditTask(task);
    setShow(true);
  };

  const handleSaveEdit = () => {
    if (editTask.trim()) {
      dispatch(editTodo({ id: editId, task: editTask }));
      setEditId(null);
      setEditTask('');
      setShow(false);
    }
  };

  const handleRemoveTodo = (id) => {
    dispatch(removeTodo(id));
  };
  
  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };

  const handleClose = () => setShow(false);

  return (
   
    <div className="container mt-5">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter new task"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleAddTodo}>
          Add Task
        </button>
      </div>
      <ul className="list-group">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
          >
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
              />
              <span className={todo.completed ? 'completed' : ''}>{todo.task}</span>
            </div>
            <div>
              <button
                className="btn btn-warning btn-sm mr-2"
                onClick={() => handleEditTodo(todo.id, todo.task)}
                disabled={todo.completed} 
              >
                Edit
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleRemoveTodo(todo.id)}
                disabled={todo.completed} 
              >
                Remove
              </button>
            </div>
          </li>
        ))}
      </ul>

      {show && (
        <div className="modal show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button type="button" className="close" onClick={handleClose}>
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Edit task"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button className="btn btn-primary" onClick={handleSaveEdit}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home
