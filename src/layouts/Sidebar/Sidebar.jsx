import { useState } from 'react';
import { Button, Nav } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import { BsFillHouseFill } from 'react-icons/bs';
import "./Sidebar.css"

const Sidebar = ({ setFilter }) => {
  const [open, setOpen] = useState(false);

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
        <Nav defaultActiveKey="/home" className="flex-column">
          <Button onClick={() => setFilter('All')}>All</Button>
          <Button onClick={() => setFilter('Done')}>Done</Button>
          <Button onClick={() => setFilter('Pending')}>Tasks Pending</Button>
        </Nav>
      </div>
    </div>
  );
};

export default Sidebar;
