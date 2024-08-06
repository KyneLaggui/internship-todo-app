import { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import { BsFillHouseFill } from 'react-icons/bs';
import './Sidebar.css';
import { useSelector } from 'react-redux';

const Sidebar = ({ setFilter, setSelectedTag }) => {
  const [open, setOpen] = useState(false);
  const todos = useSelector((state) => state.todos) || [];
  const tags = [...new Set(todos.flatMap(todo => todo.tags))];

  const toggleSidebar = () => {
    setOpen(!open);
  };

  const handleFilterClick = (value) => {
    setFilter(value);
    setSelectedTag('');
    if (open) toggleSidebar(); // Close sidebar on button click
  };

  const handleTagClick = (tag) => {
    setFilter('All');
    setSelectedTag(tag);
    if (open) toggleSidebar(); // Close sidebar on button click
  };

  const renderFilterButtons = () => (
    ['All', 'Done', 'Pending'].map(value => (
      <Button key={value} onClick={() => handleFilterClick(value)}>
        {value}
      </Button>
    ))
  );

  const renderTagButtons = () => (
    tags.length > 0 ? tags.map(tag => (
      <Button key={tag} onClick={() => handleTagClick(tag)}>
        {tag}
      </Button>
    )) : <p>No tags available</p>
  );

  return (
    <div>
      <div className="d-lg-none">
        <Button
          onClick={toggleSidebar}
          aria-controls="sidebar-content"
          aria-expanded={open}
          className="m-2"
        >
          <FaBars /> Menu
        </Button>
        <div className={`mobile-sidebar bg-dark text-white p-3 ${open ? 'show' : ''}`}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="d-flex align-items-center m-0">
              <BsFillHouseFill className="mr-2" />
              Motion
            </h4>
            <Button variant="light" onClick={toggleSidebar}>Close</Button>
          </div>
          <Nav className="flex-column">
            {renderFilterButtons()}
          </Nav>
          {renderTagButtons()}
        </div>
      </div>
      <div className="d-none d-lg-block bg-dark text-white p-3" id="sidebar">
        <h4 className="d-flex align-items-center">
          <BsFillHouseFill className="mr-2" />
          Motion
        </h4>
        <Nav className="flex-column">
          {renderFilterButtons()}
        </Nav>
        {renderTagButtons()}
      </div>
    </div>
  );
};

export default Sidebar;
