import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  removeTodo, 
  toggleComplete, 
  loadTodos, 
  completeAllTodos, 
  uncompleteAllTodos, 
  deleteAllTodos 
} from '../../redux/todosSlice';
import { Button, ListGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import { BsThreeDotsVertical } from "react-icons/bs";
import { format, differenceInDays, differenceInHours, differenceInMinutes } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import AddTodoModal from './AddTodoModal';
import EditTodoModal from './EditTodoModal';
import SortDropdown from './SortDropdown';

function TodoList({ filter, selectedTag }) {
  const todos = useSelector((state) => state.todos);
  const dispatch = useDispatch();
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editTodoData, setEditTodoData] = useState(null);
  const [sortOption, setSortOption] = useState('ascending');

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

  const handleEditTodo = (todo) => {
    setEditTodoData(todo);
    setShowEdit(true);
  };

  const handleRemoveTodo = (id) => {
    dispatch(removeTodo(id));
    toast.success("Task deleted successfully!");
  };

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
    toast.success("All tasks deleted successfully!");
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

      <div>
        <SortDropdown setSortOption={setSortOption} /> 
      </div>

      <ListGroup>
  {getFilteredAndSortedTodos().map((todo) => {
    const isExpired = new Date(todo.endDate) < new Date(); // Check if the todo is expired

    return (
      <ListGroup.Item
            key={todo.id}
            className="main-container"
            style={{ textDecoration: todo.completed || isExpired ? 'line-through' : 'none' }} // Strike through if completed or expired
          >
            <div className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                checked={todo.completed}
                onChange={() => handleToggleComplete(todo.id)}
                disabled={isExpired} // Disable checkbox if expired
              />
              <span className={todo.completed ? 'completed' : ''}>{todo.task}</span>
              <div className="text-muted ml-2">
                <small>
                  End: {todo.endDate ? format(new Date(todo.endDate), 'MM/dd/yyyy hh:mm a') : 'No end date'} <br />
                  {calculateRemainingTime(todo.endDate)} <br />
                  Tags: {todo.tags && todo.tags.length > 0 ? todo.tags.join(', ') : 'No tags'}
                </small>
              </div>
              <Dropdown className="more-options">
                <DropdownButton title={<BsThreeDotsVertical />} variant="link" id="dropdown-basic">
                  <Dropdown.Item onClick={() => handleEditTodo(todo)}>Edit</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleRemoveTodo(todo.id)}>Delete</Dropdown.Item>
                </DropdownButton>
              </Dropdown>
            </div>
          </ListGroup.Item>
        );
      })}
    </ListGroup>

      <AddTodoModal show={showAdd} handleClose={() => setShowAdd(false)} />
      <EditTodoModal show={showEdit} handleClose={() => setShowEdit(false)} todo={editTodoData} />
    </div>
  );
}

export default TodoList;
