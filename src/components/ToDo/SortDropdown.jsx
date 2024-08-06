import { Dropdown, DropdownButton } from 'react-bootstrap';

const SortDropdown = ({ setSortOption, closeSidebar }) => {
  const sortOptions = [
    { label: 'Deadline Ascending', value: 'ascending' },
    { label: 'Deadline Descending', value: 'descending' },
    { label: 'Deadline Close', value: 'close' },
    { label: 'Deadline Far', value: 'far' },
  ];

  return (
    <DropdownButton title="Sort By" variant="secondary" className="mt-2">
      {sortOptions.map(option => (
        <Dropdown.Item 
          key={option.value} 
          onClick={() => { 
            setSortOption(option.value); 
            closeSidebar(); // Close sidebar on option click
          }}
        >
          {option.label}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};

export default SortDropdown;
