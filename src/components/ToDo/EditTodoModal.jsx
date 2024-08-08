import { useState, useEffect } from 'react';
import { Button, Form, FormControl, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { editTodo } from '../../redux/todosSlice';
import { ToastContainer, toast } from 'react-toastify';

function EditTodoModal({ show, handleClose, todo }) {
  const dispatch = useDispatch();
  const [task, setTask] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (todo) {
      setTask(todo.task);
      const todoEndDate = new Date(todo.endDate);
      setEndDate(todoEndDate);
      setEndTime(todoEndDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
      setTags(todo.tags || []);
    }
  }, [todo]);

  const handleEditTodo = () => {
    if (!task.trim()) {
      toast.error("It must have a task name.");
      return;
    }

    const now = new Date();
    const endDateTime = new Date(`${endDate.toISOString().split('T')[0]}T${endTime}:00`);
    
    if (endDateTime < now) {
      toast.error("You cannot create a task for a past date or time.");
      return;
    }

    const validTags = tags.filter(tag => tag.trim() !== '');
    dispatch(editTodo({ id: todo.id, task, endDate: endDateTime.toISOString(), tags: validTags }));
    toast.success("Task updated successfully!");
    resetEditForm();
  };

  const resetEditForm = () => {
    setTask('');
    setEndDate(new Date());
    setEndTime('');
    setTags([]);
    handleClose();
  };

  // Get current date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          transition:Bounce
        />
        <Form>
          <Form.Group controlId="formTask">
            <Form.Label>Task</Form.Label>
            <Form.Control
              type="text"
              placeholder="Edit task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="formTags">
            <Form.Label>Tags</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter tags (comma-separated)"
              value={tags.join(', ')}
              onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="formEndDate">
            <Form.Label>End Date</Form.Label>
            <FormControl
              type="date"
              value={endDate.toISOString().split('T')[0]}
              min={today} // Set the minimum date to today
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="mb-3"
            />
          </Form.Group>

          <Form.Group controlId="formEndTime">
            <Form.Label>End Time</Form.Label>
            <FormControl
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="mb-3"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button className="btn-modal" onClick={handleEditTodo}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditTodoModal;
