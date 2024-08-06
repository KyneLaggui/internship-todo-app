import { useState } from 'react';
import { Button, Nav, Dropdown, DropdownButton } from 'react-bootstrap';
import { FaBars } from 'react-icons/fa';
import { BsFillHouseFill } from 'react-icons/bs';
import './Sidebar.css';
import { useSelector } from 'react-redux';

const Sidebar = ({ setFilter, setSortOption, setSelectedTag }) => {
  const [open, setOpen] = useState(false);
  const todos = useSelector((state) => state.todos) || [];
  const tags = [...new Set(todos.flatMap(todo => todo.tags))];

  const toggleSidebar = () => {
    setOpen(!open);
  };

  // Define filter buttons
  const filterOptions = [
    { label: 'All', value: 'All' },
    { label: 'Done', value: 'Done' },
    { label: 'Pending', value: 'Pending' },
  ];

  // Define sort options
  const sortOptions = [
    { label: 'Deadline Ascending', value: 'ascending' },
    { label: 'Deadline Descending', value: 'descending' },
    { label: 'Deadline Close', value: 'close' },
    { label: 'Deadline Far', value: 'far' },
  ];

  const renderFilterButtons = () => (
    filterOptions.map(option => (
      <Button key={option.value} onClick={() => { setFilter(option.value); setSelectedTag(''); }}>
        {option.label}
      </Button>
    ))
  );

  const renderSortDropdown = () => (
    <DropdownButton title="Sort By" variant="secondary" className="mt-2">
      {sortOptions.map(option => (
        <Dropdown.Item key={option.value} onClick={() => setSortOption(option.value)}>
          {option.label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );

  const renderTagButtons = () => (
    tags.length > 0 ? tags.map(tag => (
      <Button key={tag} onClick={() => { setFilter('All'); setSelectedTag(tag); }}>
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
            {renderSortDropdown()}
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
        {renderSortDropdown()}
        {renderTagButtons()}
      </div>
    </div>
  );
};

export default Sidebar;
