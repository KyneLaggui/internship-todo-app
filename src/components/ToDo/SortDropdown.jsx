import { useState } from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const SortDropdown = ({ setSortOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const sortOptions = [
    { label: 'Deadline Ascending', value: 'ascending' },
    { label: 'Deadline Descending', value: 'descending' },
    { label: 'Deadline Close', value: 'close' },
    { label: 'Deadline Far', value: 'far' },
  ];

  const handleSelect = (value) => {
    setSortOption(value);
    setIsOpen(false); 
  };

  return (
    <DropdownButton
      title="Sort By"
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
