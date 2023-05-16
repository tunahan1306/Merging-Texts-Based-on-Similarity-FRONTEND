import './App.css';

import { Routes, Route } from "react-router-dom";

import HomePages from './pages/HomePages';

function App() {
  return (
      <Routes>
        <Route path='/' element={<HomePages />} />
      </Routes>
    
  );
}

export default App;
