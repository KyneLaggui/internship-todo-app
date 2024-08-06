import { useState } from 'react';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addTodo } from '../../redux/todosSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Ensure toast styles are imported
import { format } from 'date-fns';

function AddTodoModal({ show, handleClose }) {
  const dispatch = useDispatch();
  const [newTask, setNewTask] = useState('');
  const [newEndDate, setNewEndDate] = useState(new Date());
  const [newEndTime, setNewEndTime] = useState(''); 
  const [newTags, setNewTags] = useState([]);

  const handleAddTodo = () => {
    if (!newTask.trim()) {
      toast.error("Task name cannot be empty.");
      return;
    }
  
    if (!newEndTime) {
      toast.error("Please select an end time.");
      return;
    }
  
    const now = new Date();
    const endDateTime = new Date(`${newEndDate.toISOString().split('T')[0]}T${newEndTime}:00`); 
  
    if (endDateTime < now) {
      toast.error("You cannot create a task for a past date or time.");
      return;
    }
  
    const validTags = newTags.filter(tag => tag.trim() !== '');
    dispatch(addTodo({ task: newTask, endDate: endDateTime.toISOString(), tags: validTags }));
    toast.success("Task added successfully!");
    resetAddForm();
  };
  

  const resetAddForm = () => {
    setNewTask('');
    setNewEndDate(new Date());
    setNewEndTime('');
    setNewTags([]);
    handleClose();
  };

  const getMinDate = () => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  const getMinTime = () => {
    const now = new Date();
    now.setSeconds(0);
    now.setMilliseconds(0);
    now.setMinutes(now.getMinutes() + 1);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToastContainer />
        <Form>
          <Form.Group controlId="formTask">
            <Form.Label>Task</Form.Label>
            <Form.Control
              type="text"
              placeholder="Add a new task"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="formTags">
            <Form.Label>Tags</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tags (comma-separated)"
              value={newTags.join(', ')}
              onChange={(e) => setNewTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <FormControl
              type="date"
              min={getMinDate()} 
              value={newEndDate.toISOString().split('T')[0]}
              onChange={(e) => setNewEndDate(new Date(e.target.value))}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="formEndTime">
            <Form.Label>End Time</Form.Label>
            <FormControl
              type="time"
              min={getMinTime()}
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="mb-3"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button className="btn-modal" onClick={handleAddTodo}>
          Add Task
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddTodoModal;
