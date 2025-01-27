import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import ChangeLocation from './pages/ChangeLocation';
import SeeCart from './pages/SeeCart';
import AddItem from './pages/AddItem';

import Navbar from './components/Navbar';
import {CartContextProvider} from './components/CartContext';
import {StoreAvailabilityContextProvider} from './components/StoreAvailabilityContext';

function App() {

  return (
    <CartContextProvider><StoreAvailabilityContextProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<ChangeLocation/>} />
          <Route path="/change-location" element={<ChangeLocation/>} />
          <Route path="/see-cart" element={<SeeCart />} />
          <Route path="/add-item" element={<AddItem />} />
        </Routes>
      </Router>
    </StoreAvailabilityContextProvider></CartContextProvider>
  );
}

export default App;
