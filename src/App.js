import React, { useState } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import ChangeLocation from './pages/ChangeLocation';
import SeeCart from './pages/SeeCart';
import AddItem from './pages/AddItem';

import Navbar from './components/Navbar';
import SUPPORTED_STORES from './components/SupportedStores';
import {CartContextProvider} from './components/CartContext';
import {StoreAvailabilityContextProvider} from './components/StoreAvailabilityContext';

function App() {

  // const [apiList, setApiList] = useState(
  //   SUPPORTED_STORES.map((store) => ({
  //     name: store,
  //     enabled: false,
  //   }))
  // );

  // const [krogerLocations, setKrogerLocations] = useState([]);

  return (
    <CartContextProvider><StoreAvailabilityContextProvider>
      <Router>
        <Navbar />

        <Routes>
          <Route path="/" element={<ChangeLocation
            // apiList={apiList}
            // setApiList={setApiList}
          />} />
          <Route path="/change-location" element={<ChangeLocation
            // apiList={apiList}
            // setApiList={setApiList}
            // krogerLocations = {krogerLocations}
            // setKrogerLocations = {setKrogerLocations}
          />} />
          <Route path="/see-cart" element={<SeeCart />} />
          <Route path="/add-item" element={<AddItem />} />
        </Routes>
      </Router>
    </StoreAvailabilityContextProvider></CartContextProvider>
  );
}

export default App;
