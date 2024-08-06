import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { editTodo } from '../../redux/todosSlice';
import { ToastContainer, toast } from 'react-toastify';
import { format } from 'date-fns';

function EditTodoModal({ show, handleClose, todo }) {
  const dispatch = useDispatch();
  const [task, setTask] = useState('');
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState('');
  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (todo) {
      setTask(todo.task);
      setEndDate(new Date(todo.endDate));
      setEndTime(new Date(todo.endDate).toISOString().split('T')[1].substring(0, 5));
      setTags(todo.tags || []);
    }
  }, [todo]);

  const handleEditTodo = () => {
    if (task.trim()) {
      const now = new Date();
      const endDateTime = new Date(`${endDate.toISOString().split('T')[0]}T${endTime}`);
      
      if (endDateTime < now) {
        toast.error("You cannot create a task for a past date or time.");
        return;
      }

      const validTags = tags.filter(tag => tag.trim() !== '');
      dispatch(editTodo({ id: todo.id, task, endDate: endDateTime.toISOString(), tags: validTags }));
      toast.success("Task updated successfully!");
      resetEditForm();
    }
  };

  const resetEditForm = () => {
    setTask('');
    setEndDate(new Date());
    setEndTime('');
    setTags([]);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Task</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToastContainer />
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Edit task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Enter tags (comma-separated)"
            value={tags.join(', ')}
            onChange={(e) => setTags(e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag !== ''))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>End Date</Form.Label>
          <input
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>End Time</Form.Label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleEditTodo}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditTodoModal;
