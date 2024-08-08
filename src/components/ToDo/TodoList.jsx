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
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import AddTodoModal from './AddTodoModal';
import EditTodoModal from './EditTodoModal';
import SortDropdown from './SortDropdown';
import noTasksImage from '../../assets/no-tasks.png'; 
import "./TodoList.css"
import { CiCalendar } from 'react-icons/ci';
import { FaCheck, FaCircle, FaPlus, FaRegClock, FaTrash, FaUndo } from 'react-icons/fa';
import { HiOutlineHashtag } from 'react-icons/hi';

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
    const currentTodos = todos.filter(todo => new Date(todo.endDate) >= new Date());
    if (currentTodos.length === 0) {
      toast.error("No tasks available to mark as done!");
      return;
    }
    dispatch(completeAllTodos(currentTodos.map(todo => todo.id))); 
    toast.success("All tasks marked as done!");
  };
  
  const handleUncompleteAll = () => {
    const currentTodos = todos.filter(todo => new Date(todo.endDate) >= new Date());
    if (currentTodos.length === 0) {
      toast.error("No tasks available to mark as undone!");
      return;
    }
    dispatch(uncompleteAllTodos(currentTodos.map(todo => todo.id)));
    toast.success("All tasks marked as undone!");
  };
  
  
  const handleDeleteAll = () => {
    dispatch(deleteAllTodos());
    toast.success("All tasks deleted successfully!");
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const calculateRemainingTime = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const totalSeconds = Math.floor((end - now) / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (isMobile) {
      return `${String(days).padStart(2, '0')}:${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
      if (totalSeconds > 0) {
        if (days > 0) {
          return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds remaining`;
        } else if (hours > 0) {
          return `${hours} hours ${minutes} minutes ${seconds} seconds remaining`;
        } else if (minutes > 0) {
          return `${minutes} minutes ${seconds} seconds remaining`;
        } else {
          return `Less than a minute left`;
        }
      } else {
        return 'Time expired';
      }
    }
  };
  

  const filteredAndSortedTodos = getFilteredAndSortedTodos();

  return (
    <div className="todo-container">
      <ToastContainer />

      <div className="buttons-container">
        <Button className="btn-list" onClick={() => setShowAdd(true)}>
          <FaPlus style={{ marginRight: '8px' }} /> New Task
        </Button>
        <Button className="btn-list" onClick={handleCompleteAll}>
          <FaCheck style={{ marginRight: '8px' }} /> Done All
        </Button>
        <Button className="btn-list" onClick={handleUncompleteAll}>
          <FaUndo style={{ marginRight: '8px' }} /> Undone All
        </Button>
        <Button className="btn-list" onClick={handleDeleteAll}>
          <FaTrash style={{ marginRight: '8px' }} /> Delete All
        </Button>
      </div>

      <div>
        <SortDropdown setSortOption={setSortOption} /> 
      </div>

      {filteredAndSortedTodos.length === 0 ? (
        <div className="no-tasks-container">
          <img src={noTasksImage} alt="No tasks" className="no-tasks-image" />
          <p className='gray-text'>No tasks available!</p>
        </div>
      ) : (
        <ListGroup>
          {filteredAndSortedTodos.map((todo) => {
            const isExpired = new Date(todo.endDate) < new Date(); 

            return (
              <ListGroup.Item
                key={todo.id}
                className="main-container"
                style={{ textDecoration: todo.completed || isExpired ? 'line-through' : 'none' }} 
              >
                <div className="form-check">
                  <div className='tasks-left'>
                    <input
                      type="checkbox"
                      className="form-check-input checkbox-tasks"
                      checked={todo.completed}
                      onChange={() => handleToggleComplete(todo.id)}
                      disabled={isExpired}
                    />
                    <div className='tasks-contents'>
                      <span className={todo.completed ? 'completed' : ''}>
                        <div className='tasks-important'>
                          <h1 className="tasks-title">{todo.task}</h1>
                          {todo.endDate && (  
                            <div className='tasks-date'>
                              <span className='tasks-icon'>
                                <CiCalendar size={14} /> {format(new Date(todo.endDate), 'MM/dd/yyyy')}
                              </span>
                              <span className='tasks-icon'>
                                <FaRegClock size={14} /> {format(new Date(todo.endDate), 'hh:mm a')}
                              </span>
                            </div>
                          )}
                        </div>
                      </span>
                    </div>
                  </div>
                  
                  <div className='tasks-right'>
                    <div className="tasks-subcategories">  
                      <div className='tasks-deadline'>
                        <FaCircle size={8} />
                        {calculateRemainingTime(todo.endDate)}
                      </div>
                      <div className={`tasks-tags ${!(todo.tags && todo.tags.length > 0) ? 'tags-hidden' : ''}`}>
                        <HiOutlineHashtag />
                        {todo.tags && todo.tags.join(', ')}
                      </div>
                      
                    </div>
                    <Dropdown className="more-options">
                      <DropdownButton title={<BsThreeDotsVertical />} variant="link" id="dropdown-basic" >
                        <Dropdown.Item onClick={() => handleEditTodo(todo)}>Edit</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleRemoveTodo(todo.id)}>Delete</Dropdown.Item>
                      </DropdownButton>
                    </Dropdown>
                  </div>
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}

      <AddTodoModal show={showAdd} handleClose={() => setShowAdd(false)} />
      <EditTodoModal show={showEdit} handleClose={() => setShowEdit(false)} todo={editTodoData} />
    </div>
  );
}

export default TodoList;
