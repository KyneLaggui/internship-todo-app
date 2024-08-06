// import Home from './pages/Home'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './layouts/Sidebar/Sidebar';
import { useState } from 'react';
import TodoList from './components/ToDo/TodoList';

function App() {
  const [filter, setFilter] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [selectedTag, setSelectedTag] = useState('');

  return (
    <>
    <Sidebar setFilter={setFilter} setSelectedTag={setSelectedTag} />
    {/* <Home filter={filter} 
        sortOption={sortOption} 
        setSortOption={setSortOption}
        selectedTag={selectedTag} />  */}
    <TodoList 
        filter={filter} 
        sortOption={sortOption} 
        setSortOption={setSortOption}
        selectedTag={selectedTag} 
      />
    
    </>
  )
}

export default App
