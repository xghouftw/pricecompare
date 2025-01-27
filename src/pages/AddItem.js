import React, { useState, useContext } from 'react';
import ItemCard from '../components/ItemCard';
import { StoreAvailabilityContext } from '../components/StoreAvailabilityContext';
import '../App.css';
import './AddItem.css';

function AddItem() {
  const { apiList, krogerLocations, supportedStores } = useContext(StoreAvailabilityContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null); // message to display on site

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!searchTerm.trim()) return; // no empty searches

    setError(null);
    setProducts([]); //reset for new search

    let combinedResults = [];

    console.log(apiList);
    for (const store of apiList) {
      if (!store.enabled) continue;
      switch (store.name) {
        case 'Kroger':
          try {
            const url = new URL("https://pricecompareserver.onrender.com");
            url.pathname = "/kroger/catalog";
            url.searchParams.set("searchTerm", searchTerm);
            url.searchParams.set("krogerLocations", krogerLocations.join(','));

            const response = await fetch(url.toString());
            const data = await response.json();
            console.log(data);

            combinedResults = [...combinedResults, ...data];
          } catch (err) {
            setError("Error fetching Kroger products");
            console.log(err);
          }
          break;
    
        case 'Walmart':
          try {
            const url = new URL("https://pricecompareserver.onrender.com");
            url.pathname = "/walmart/catalog";
            url.searchParams.set("searchTerm", searchTerm);

            const response = await fetch(url.toString());
            const data = await response.json();
            combinedResults = [...combinedResults, ...data];
          } catch (err) {
            setError("Error fetching Walmart products");
            console.log(err);
          }
          break;
      }
    }
    combinedResults.sort((a, b) => a.price - b.price); //sort in ascending order
    setProducts(combinedResults);
  };

  return (
    <div className="page-container">
      <h1>Add Item</h1>

      <div className = "search-container">
        <form onSubmit={handleSearch} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search for an item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {supportedStores.length === 0 ? (
        <p><strong>Warning:</strong> There are no supported stores available near you, so the search will not return anything.
          Make there's a supported store within the radius of your set location.
        </p>
      ) : (
        <div className="item-grid">
          {products.map((product) => (
            <ItemCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}

export default AddItem;