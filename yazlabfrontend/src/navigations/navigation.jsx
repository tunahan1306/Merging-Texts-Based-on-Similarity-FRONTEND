import React from 'react'
import { Routes, Route } from "react-router-dom";

import HomePages from '../pages/HomePages';

const navigation = () => {
  return (
  <Routes>
    <Route path='/' element={<HomePages />} />
  </Routes>
    
  )
}

export default navigation
