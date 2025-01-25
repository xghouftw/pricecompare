import React, { useState, useEffect, useContext } from 'react';
import { searchCatalog as searchWalmart } from '../services/WalmartCatalog';
import { StoreAvailabilityContext } from '../components/StoreAvailabilityContext';

function AddItem() {

  const { apiList, krogerLocations } = useContext(StoreAvailabilityContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return; // no empty searches

    let combinedResults = [];

    for (const store of apiList) {
      if (!store.enabled) return;
    
      switch (store.name) {
        case 'Kroger':
          try {
            // const url = new URL("http://localhost:5000");
            const url = new URL("https://pricecompareserver.onrender.com");
            url.pathname = "/kroger/catalog";
            url.searchParams.set("searchTerm", searchTerm);
            url.searchParams.set("krogerLocations", krogerLocations.join(','));

            const response = await fetch(url.toString());
            const data = await response.json();

            combinedResults = [...combinedResults, ...data];
            // const catalog = await searchKroger("oranges", krogerLocations);
            // console.log(catalog);

          } catch (err) {
            console.log(err);
          }
          break;
    
        case 'Walmart':
          try {
            const data = await searchWalmart("oranges");
            combinedResults = [...combinedResults, ...data];
          } catch (err) {
            console.log(err);
          }
          break;
      }
    }

    setProducts(combinedResults);
  };

  return (
    <div>
      <h2>Add Item</h2>
      
      {/* Search form */}
      <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Search for an item..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      
      {/* Display search results */}
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            {/* Customize how you display product details */}
            {product.description} – {product.brand} - {product.price} - {product.store}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddItem;