import { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { FaBars, FaCheck, FaClock, FaList } from 'react-icons/fa';
import './Sidebar.css';
import { useSelector } from 'react-redux';
import { FaPersonRunning } from 'react-icons/fa6';
import { PiTagSimpleDuotone } from 'react-icons/pi';
import { IoMdCloseCircle } from 'react-icons/io';

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
    if (open) toggleSidebar(); 
  };

  const handleTagClick = (tag) => {
    setFilter('All');
    setSelectedTag(tag);
    if (open) toggleSidebar(); 
  };

  const buttonIcons = {
    All: <FaList />,
    Done: <FaCheck />,
    Pending: <FaClock />,
  };

  const renderFilterButtons = () => (
    ['All', 'Done', 'Pending'].map(value => (
      <Button key={value} className='sidebar-buttons' onClick={() => handleFilterClick(value)}>
        {buttonIcons[value]} <span style={{ marginLeft: '8px' }}>{value}</span>
      </Button>
    ))
  );

  const renderTagButtons = () => (
     tags.map(tag => (   
      <Button key={tag} className='sidebar-buttons' onClick={() => handleTagClick(tag)}>
      <span style={{ marginRight: '8px' }}><PiTagSimpleDuotone /></span>
        {tag}
      </Button>   
    )) 
  );

  return (
    <div>
      <div className="d-lg-none">
        <Button
          onClick={toggleSidebar}
          className="hamburger-sb"
        >
          <FaBars onClick={toggleSidebar} />
        </Button>
        <div className={`mobile-sidebar bg-white custom-dark-gray p-3 ${open ? 'show' : ''}`}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="d-flex align-items-center sidebar-title">
              <FaPersonRunning />
              Motion
            </h4>
            <IoMdCloseCircle color='var(--purple-dark)' size={24} onClick={toggleSidebar} />
          </div>
          <Nav className="flex-column">
            {renderFilterButtons()}
          </Nav>
          {renderTagButtons()}
        </div>
      </div>
      <div className="d-none d-lg-block bg-white custom-dark-gray p-3 sidebar" id="sidebar">
        <h4 className="d-flex align-items-center sidebar-title mb-4">
          <FaPersonRunning />
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
