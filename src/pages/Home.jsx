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
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

function TodoList({ filter, sortOption, selectedTag }) {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState('');
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [newEndTime, setNewEndTime] = useState(''); 
  const [editTask, setEditTask] = useState('');
  const [editEndDate, setEditEndDate] = useState(new Date());
  const [editEndTime, setEditEndTime] = useState(''); 
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
      const hasSelectedTag = selectedTag ? (todo.tags && todo.tags.includes(selectedTag)) : true;
      const matchesFilter = (() => {
        switch (filter) {
          case 'Done':
            return todo.completed;
          case 'Pending':
            return !todo.completed;
          case 'All':
          default:
            return true;
        }
      })();
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
      const now = new Date();
      const endDateTime = new Date(`${newEndDate.toISOString().split('T')[0]}T${newEndTime}`); // Combine date and time
    
      // Check if the end date and time is in the past
      if (endDateTime < now) {
        toast.error("You cannot create a task for a past date or time.");
        return;
      }
    
      const validTags = newTags.filter(tag => tag.trim() !== '');
      dispatch(addTodo({ task: newTask, endDate: endDateTime.toISOString(), tags: validTags }));
      toast.success("Task added successfully!"); // Show success toast
      resetAddForm();
    }
  };

  const handleEditTodo = (id, task, endDate, tags) => {
    setEditId(id);
    setEditTask(task);
    setEditEndDate(new Date(endDate));
    setEditEndTime(endDate.split('T')[1]); 
    setEditTags(tags);
    setShowEdit(true);
  };

  const handleSaveEdit = () => {
    if (editTask.trim()) {
      const endDateTime = `${editEndDate.toISOString().split('T')[0]}T${editEndTime}`;
      const now = new Date();
      if (editEndDate < now || (editEndDate.toISOString().split('T')[0] === now.toISOString().split('T')[0] && editEndTime < now.toTimeString().split(' ')[0])) {
        toast.error("You cannot set a past date or time for a task.");
        return;
      }

      const validTags = editTags.filter(tag => tag.trim() !== '');
      dispatch(editTodo({ id: editId, task: editTask, endDate: endDateTime, tags: validTags }));
      toast.success("Task edited successfully!"); // Show success toast
      resetEditForm();
    }
  };

  const handleRemoveTodo = (id) => {
    dispatch(removeTodo(id));
    toast.success("Task deleted successfully!"); // Show success toast
  };

  const resetAddForm = () => {
    setNewTask('');
    setNewEndDate(new Date());
    setNewEndTime('');
    setNewTags([]);
    setShowAdd(false);
  };

  const resetEditForm = () => {
    setEditId(null);
    setEditTask('');
    setEditEndDate(new Date());
    setEditEndTime('');
    setEditTags([]);
    setShowEdit(false);
  };

  const handleCloseAdd = () => setShowAdd(false);
  const handleCloseEdit = () => setShowEdit(false);
  const handleToggleComplete = (id) => {
    dispatch(toggleComplete(id));
  };
  const handleCompleteAll = () => {
    dispatch(completeAllTodos());
  };
  const handleUncompleteAll = () => {
    dispatch(uncompleteAllTodos());
  };
  const handleDeleteAll = () => {
    dispatch(deleteAllTodos());
    toast.success("All tasks deleted successfully!"); // Show success toast
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

  // Calculate the minimum date and time for the inputs
  const getMinDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const now = new Date();
    now.setSeconds(0); // Set seconds to 0 for cleaner input
    now.setMilliseconds(0); // Set milliseconds to 0
    now.setMinutes(now.getMinutes() + 1); // Add one minute to the current time
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="todo-container">
      <ToastContainer /> 

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
               <div className="mt-2">
                {todo.tags && todo.tags.length > 0 ? (
                  todo.tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary me-1">{tag}</span>
                  ))
                ) : (
                  <span className="text-muted">No tags</span>
                )}
              </div>
              <span className={todo.completed ? 'completed' : ''}>{todo.task}</span>
              <div className="text-muted ml-2">
                <small>
                  {todo.modifiedAt 
                    ? `Modified: ${todo.modifiedAt}` 
                    : `Created: ${todo.createdAt}`} <br />
                  End: {todo.endDate ? format(new Date(todo.endDate), 'MM/dd/yyyy hh:mm a') : 'No end date'} <br />
                  {calculateRemainingTime(todo.endDate)}
                </small>
              </div>
              <Dropdown className="more-options">
                <DropdownButton title={<BsThreeDotsVertical />} variant="link" id="dropdown-basic">
                  <Dropdown.Item onClick={() => handleEditTodo(todo.id, todo.task, todo.endDate, todo.tags)}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleRemoveTodo(todo.id)}>Delete</Dropdown.Item>
                </DropdownButton>
              </Dropdown>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* Add Task Modal */}
      <Modal show={showAdd} onHide={handleCloseAdd}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="Add a new task"
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
            <Form.Label>End Date</Form.Label>
            <input
              type="date"
              min={getMinDate()} 
              value={newEndDate.toISOString().split('T')[0]}
              onChange={(e) => setNewEndDate(new Date(e.target.value))}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>End Time</Form.Label>
            <input
              type="time"
              min={getMinTime()}
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAdd}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddTodo}>
            Add Task
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Task Modal */}
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
            <Form.Control
              type="text"
              placeholder="Enter tags (comma-separated)"
              value={editTags.join(', ')}
              onChange={(e) => setEditTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))} // Filter empty tags
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>End Date</Form.Label>
            <input
              type="date"
              min={getMinDate()} // Set minimum date
              value={editEndDate.toISOString().split('T')[0]}
              onChange={(e) => setEditEndDate(new Date(e.target.value))}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>End Time</Form.Label>
            <input
              type="time"
              min={getMinTime()} // Set minimum time
              value={editEndTime}
              onChange={(e) => setEditEndTime(e.target.value)}
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
