import Home from './pages/Home'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './layouts/Sidebar/Sidebar';
import { useState } from 'react';

function App() {
  const [filter, setFilter] = useState('All');

  return (
    <>
    <Sidebar setFilter={setFilter} />
    <Home filter={filter}/>
    </>
  )
}

export default App
