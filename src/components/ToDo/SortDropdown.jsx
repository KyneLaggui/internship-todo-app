import { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { FaFilter } from 'react-icons/fa';

const SortDropdown = ({ setSortOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { label: 'Ascending', value: 'ascending' },
    { label: 'Descending', value: 'descending' },
    { label: 'Upcoming Deadline', value: 'close' },
    { label: 'Distant Deadline', value: 'far' },
  ];

  const handleSelect = (value) => {
    setSortOption(value);
    setIsOpen(false); 
  };

  return (
    <DropdownButton
    title={
      <div className='filter'>
        <FaFilter />
        Sort By
      </div>
    }
      variant="secondary"
      className="mt-2"
      onToggle={(nextOpen) => setIsOpen(nextOpen)} 
      show={isOpen} 
    >
      {sortOptions.map(option => (
        <Dropdown.Item
          key={option.value}
          onClick={() => handleSelect(option.value)} 
        >
          {option.label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default SortDropdown;
