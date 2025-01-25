import React, { useState, useEffect, useContext } from 'react';
import { searchCatalog as searchWalmart } from '../services/WalmartCatalog';
import { searchCatalog as searchKroger } from '../services/KrogerCatalog';
import { StoreAvailabilityContext } from '../components/StoreAvailabilityContext';

function AddItem() {

  const { apiList, krogerLocations } = useContext(StoreAvailabilityContext);

  useEffect(() => {
    const fetchCatalog = async () => {

      for (const store of apiList) {
        if (!store.enabled) return;
      
        switch (store.name) {
          case 'Kroger':
            try {
              // const url = new URL("http://localhost:5000");
              const url = new URL("https://pricecompareserver.onrender.com");
              url.pathname = "/kroger/catalog";
              url.searchParams.set("searchTerm", "oranges");
              console.log(krogerLocations);
              url.searchParams.set("krogerLocations", krogerLocations.join(','));

              const response = await fetch(url.toString(), {
              }).then(response => response.json());
              console.log(response);
              // const catalog = await searchKroger("oranges", krogerLocations);
              // console.log(catalog);

            } catch (err) {
              console.log(err);
            }
            break;
      
          case 'Walmart':
            try {
              const catalog = await searchWalmart("oranges");
            } catch (err) {
              console.log(err);
            }
            break;
        }
      }
    };

    fetchCatalog();
  });

  
  return (
    <div>
      <h2>Add Item</h2>
      {/* <ul>
        {products.map((product, index) => (
          <li key={index}>{product.name}</li>
        ))}
      </ul> */}
    </div>
  );
}

export default AddItem;
