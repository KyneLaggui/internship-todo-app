import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  addTodo, 
  editTodo, 
  removeTodo, 
  toggleComplete, 
  loadTodos, 
  completeAllTodos, 
  uncompleteAllTodos, 
  deleteAllTodos 
} from '../redux/todosSlice';
import { Button, Form, ListGroup, Modal, Dropdown, DropdownButton } from 'react-bootstrap';
import { BsThreeDotsVertical } from "react-icons/bs";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';

function TodoList({ filter, sortOption, selectedTag }) {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState('');
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [editTask, setEditTask] = useState('');
  const [editEndDate, setEditEndDate] = useState(new Date());
  const [editId, setEditId] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTags, setEditTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem('todos')) || [];
    dispatch(loadTodos(storedTodos));
  }, [dispatch]);

  const getFilteredAndSortedTodos = () => {
    const filteredTodos = todos.filter(todo => {
      // Check if the selected tag matches the todo's tags or if no tag is selected
      const hasSelectedTag = selectedTag ? (todo.tags && todo.tags.includes(selectedTag)) : true;
  
      // Check if the todo matches the current filter (Done, Pending, or All)
      const matchesFilter = (() => {
        switch (filter) {
          case 'Done':
            return todo.completed;
          case 'Pending':
            return !todo.completed;
          case 'All':
          default:
            return true; // Show all todos, regardless of status
        }
      })();
  
      // Return todos that match the current filter and the selected tag (if applicable)
      return matchesFilter && hasSelectedTag;
    });

    const todosCopy = [...filteredTodos];
  
    switch (sortOption) {
      case 'ascending':
        return todosCopy.sort((a, b) => a.task.localeCompare(b.task));
      case 'descending':
        return todosCopy.sort((a, b) => b.task.localeCompare(a.task));
      case 'close':
        return todosCopy.sort((a, b) => new Date(a.endDate) - new Date(b.endDate)).slice(0, 5);
      case 'far':
        return todosCopy.sort((a, b) => new Date(b.endDate) - new Date(a.endDate)).slice(0, 5);
      default:
        return todosCopy;
    }
  };

  const handleAddTodo = () => {
    if (newTask.trim()) {
      const validTags = newTags.filter(tag => tag.trim() !== '');
      dispatch(addTodo({ task: newTask, endDate: newEndDate.toISOString(), tags: validTags }));
      setNewTask('');
      setNewEndDate(new Date());
      setNewTags([]);
      setShowAdd(false);
    }
  };

  const handleEditTodo = (id, task, endDate, tags) => {
    setEditId(id);
    setEditTask(task);
    setEditEndDate(new Date(endDate));
    setEditTags(tags)
    setShowEdit(true);
  };

  const handleSaveEdit = () => {
    if (editTask.trim()) {
      const validTags = editTags.filter(tag => tag.trim() !== '');
      dispatch(editTodo({ id: editId, task: editTask, endDate: editEndDate.toISOString(), tags: validTags }));
      setEditId(null);
      setEditTask('');
      setEditEndDate(new Date());
      setEditTags([]);
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

  const handleCompleteAll = () => {
    dispatch(completeAllTodos());
  };

  const handleUncompleteAll = () => {
    dispatch(uncompleteAllTodos());
  };

  const handleDeleteAll = () => {
    dispatch(deleteAllTodos());
  };
  

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const days = differenceInDays(end, now);
    const hours = differenceInHours(end, now) % 24;
    const minutes = differenceInMinutes(end, now) % 60;

    if (days > 0) {
      return `${days} days ${hours} hours ${minutes} minutes remaining`;
    } else if (hours > 0) {
      return `${hours} hours ${minutes} minutes remaining`;
    } else if (minutes > 0) {
      return `${minutes} minutes remaining`;
    } else {
      return 'Time expired';
    }
  };

  return (
    <div className="todo-container">
      <div className="buttons-container">
        <Button className="button-main" onClick={() => setShowAdd(true)}>
          + New Task
        </Button>
        <Button variant="success" onClick={handleCompleteAll}>
          Done All
        </Button>
        <Button variant="warning" onClick={handleUncompleteAll}>
          Undone All
        </Button>
        <Button variant="danger" onClick={handleDeleteAll}>
          Delete All
        </Button>
      </div>

      <ListGroup>
        {getFilteredAndSortedTodos().map((todo) => (
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
              <h1>{todo.tags}</h1>
              <span className={todo.completed ? 'completed' : ''}>{todo.task}</span>
              <div className="text-muted ml-2">
                <small>
                  {todo.modifiedAt 
                    ? `Modified: ${todo.modifiedAt}` 
                    : `Created: ${todo.createdAt}`} <br />
                  End: {todo.endDate ? format(new Date(todo.endDate), 'MM/dd/yyyy hh:mm a') : 'No end date'} <br />
                  {todo.endDate ? calculateRemainingTime(todo.endDate) : 'No end date'}
                </small>
              </div>
            </div>
            
            <div>
              <DropdownButton
                id="dropdown-basic-button"
                title={<BsThreeDotsVertical />}
                variant="secondary"
                size="sm"
                className="mr-2"
              >
                <Dropdown.Item onClick={() => handleEditTodo(todo.id, todo.task, todo.endDate, todo.tags)} disabled={todo.completed}>
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
          <Form.Group>
            <Form.Control
                type="text"
                placeholder="Enter tags (comma-separated)"
                value={newTags.join(', ')}
                onChange={(e) => setNewTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))} // Filter empty tags
              />
          </Form.Group>
          <Form.Group>
            <DatePicker
              selected={newEndDate}
              onChange={(date) => setNewEndDate(date)}
              showTimeSelect
              timeIntervals={15}
              dateFormat="MM/dd/yyyy hh:mm aa"
              className="form-control"
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

          <Form.Group>
            <Form.Label>Tags</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tags (comma-separated)"
              value={editTags.join(', ')}
              onChange={(e) => setEditTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))} 
            />
          </Form.Group>

          <Form.Group>
            <DatePicker
              selected={editEndDate}
              onChange={(date) => setEditEndDate(date)}
              showTimeSelect
              timeIntervals={1} 
              dateFormat="MM/dd/yyyy hh:mm aa"
              className="form-control"
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