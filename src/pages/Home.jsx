import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTodo, editTodo, removeTodo, toggleComplete, loadTodos } from '../redux/todosSlice';
import { Button, Form, ListGroup, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import { BsThreeDotsVertical } from "react-icons/bs";

function TodoList() {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState('');
  const [editTask, setEditTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    dispatch(loadTodos(storedTodos));
  }, [dispatch]);

  const handleAddTodo = () => {
    if (newTask.trim()) {
      dispatch(addTodo(newTask));
      setNewTask('');
      setShowAdd(false);
    }
  };

  const handleEditTodo = (id, task) => {
    setEditId(id);
    setEditTask(task);
    setShowEdit(true);
  };

  const handleSaveEdit = () => {
    if (editTask.trim()) {
      dispatch(editTodo({ id: editId, task: editTask }));
      setEditId(null);
      setEditTask('');
      setShowEdit(false);
    }
  };

  const handleCloseAdd = () => setShowAdd(false);
  const handleCloseEdit = () => setShowEdit(false);

  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };

  const handleRemoveTodo = (id) => {
    dispatch(removeTodo(id));
  };

  return (
    <div className="todo-container">
      <h1 className='title'>Motion</h1>
      <Button className="button-main" onClick={() => setShowAdd(true)}>
        + New Task
      </Button>

      <ListGroup>
        {todos.map((todo) => (
          <ListGroup.Item
            key={todo.id}
            className="main-container"
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
              <div className="text-muted ml-2">
                <small>
                  {todo.modifiedAt 
                    ? `Modified: ${todo.modifiedAt}` 
                    : `Created: ${todo.createdAt}`}
                </small>
              </div>
            </div>
            <div>
              <DropdownButton
                id="dropdown-basic-button"
                title= {<BsThreeDotsVertical />}
                variant="secondary"
                size="sm"
                className="mr-2"
               
              >
                <Dropdown.Item onClick={() => handleEditTodo(todo.id, todo.task)} disabled={todo.completed}>
                  Edit
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleRemoveTodo(todo.id)} disabled={todo.completed}>
                  Remove
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Enter new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTodo}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEdit} onHide={handleCloseEdit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Edit task"
              value={editTask}
              onChange={(e) => setEditTask(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default TodoList;
