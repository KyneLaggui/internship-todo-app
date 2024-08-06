import { useState } from 'react';
import { Button, Nav, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import { BsFillHouseFill } from 'react-icons/bs';
import "./Sidebar.css"
import { useSelector } from 'react-redux';

const Sidebar = ({ setFilter, setSortOption, setSelectedTag }) => {
  const [open, setOpen] = useState(false);
  const todos = useSelector((state) => state.todos) || [];
  const tags = [...new Set(todos.flatMap(todo => todo.tags))];

  const toggleSidebar = () => {
    setOpen(!open);
  };

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
          <Nav defaultActiveKey="/home" className="flex-column">
            <Nav.Link href="/home" className="text-white">Home</Nav.Link>
            <Nav.Link href="/about" className="text-white">About</Nav.Link>
            <Nav.Link href="/contact" className="text-white">Contact</Nav.Link>
          </Nav>
        </div>
      </div>
      <div className="d-none d-lg-block bg-dark text-white p-3" id="sidebar">
        <h4 className="d-flex align-items-center">
          <BsFillHouseFill className="mr-2" />
          Motion
        </h4>
        <Nav className="flex-column">
          <Button onClick={() => { setFilter('All'); setSelectedTag(''); }}>All</Button>
          <Button onClick={() => { setFilter('Done'); }}>Done</Button>
          <Button onClick={() => { setFilter('Pending')}}>Tasks Pending</Button>
        </Nav>

        <DropdownButton title="Sort By" variant="secondary" className="mt-2">
            <Dropdown.Item onClick={() => setSortOption('ascending')}>Deadline Ascending</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption('descending')}>Deadline Descending</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption('close')}>Deadline Close</Dropdown.Item>
            <Dropdown.Item onClick={() => setSortOption('far')}>Deadline Far</Dropdown.Item>
        </DropdownButton>
          {tags.map(tag => (
          <Button key={tag} onClick={() => { setFilter('All'); setSelectedTag(tag); }}>{tag}</Button>
        ))}
        
        
      </div>
    </div>
  );
};

export default Sidebar;