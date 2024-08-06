import Home from './pages/Home'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './layouts/Sidebar/Sidebar';
import { useState } from 'react';

function App() {
  const [filter, setFilter] = useState('All');
  const [sortOption, setSortOption] = useState('default');

  return (
    <>
    <Sidebar setFilter={setFilter} setSortOption={setSortOption} /> 
    <Home filter={filter} sortOption={sortOption} /> 
    </>
  )
}

export default App
