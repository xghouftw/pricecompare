import React, { useState, useEffect, useContext } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { searchNearbyPlaces } from '../services/GoogleNearbySearch';
import { StoreAvailabilityContext } from '../components/StoreAvailabilityContext';
import '../App.css';
import './ChangeLocation.css';

const mapsApiKey=process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function ChangeLocation() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null); // message to display on site
  const [unsupportedStores, setUnsupportedStores] = useState([]);

  const [radius, setRadius] = useState(5); // default radius in km

  const { apiList, setApiList, setKrogerLocations, supportedStores, setSupportedStores } = useContext(StoreAvailabilityContext);

  // maps properties
  const mapContainerStyle = { width: '900px', height: '500px'};
  const defaultCenter = { lat: 0, lng: 0 };
  
  const handleMapClick = (e) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  };
  
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation cannot run in this browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (err) => {
        setError('Error retrieving location');
        console.error('Geolocation error: ', err);
      }
    );
  };

  // Detect location on loading page
  useEffect(() => {
    handleDetectLocation();
  }, []); 

  // nearby grocery stores with Google Places API
  useEffect(() => {
    if (location.lat && location.lng) {
      const fetchNearbyStores = async () => {
        try {
          const nearbyStores = await searchNearbyPlaces(location.lat, location.lng, radius*1000);
          setStores(nearbyStores);
        } catch (err) {
          setError("Error fetching nearby places");
          console.error(err);
        }
      };

      fetchNearbyStores();
    }
  }, [location, radius]);

  // update supported stores based on detected location
  useEffect(() => {
    let newApiList = [...apiList];
    const unsupported = [];
    const supported = [];

    for (let j = 0; j < newApiList.length; j++) newApiList[j].enabled = false;

    if (stores.length > 0) {
      for (let i = 0; i < stores.length; i++) {
        let sup = false;
        for (let j = 0; j < newApiList.length; j++) {
          if (stores[i].toLowerCase().includes(newApiList[j].name.toLowerCase())) {
            newApiList[j].enabled = true;
            sup = true;
          } 
        }
        if (sup) supported.push(stores[i]);
        else unsupported.push(stores[i]);
      }
    }

    if (location.lat && location.lng) {
      for (let i = 0; i < apiList.length; i++) {
        if (apiList[i].name === "Kroger") {
          const fetchNearbyKroger = async () => {
            try {
              const url = new URL("https://pricecompareserver.onrender.com")
              url.pathname = "/kroger/locations";
              url.searchParams.set("latlong", `${location.lat},${location.lng}`);
              const data = await fetch(url.toString());
              const locations = await data.json();
              setKrogerLocations(locations);
            } catch (err) {
              console.error(err);
            }
          };
          fetchNearbyKroger();
        } 
      }
    }   
    setApiList(newApiList);
    setUnsupportedStores(unsupported);
    setSupportedStores(supported);

  }, [stores]);

  return (
    <div className="page-container">
      <h1>Change Location</h1>

      <div className='change-location-button-container'>
        <button onClick = {handleDetectLocation}>
          Automatically detect my location
        </button>
      </div>
      
      {location.lat && location.lng ? (
        <p>Detected your location at latitude: {location.lat.toFixed(6)}, longitude: {location.lng.toFixed(6)}</p>
      ) : (
        <p>No location detected yet.</p>
      )}
      <p>Or, manually click the location marker on the map.</p>
      {error && <p className='error'>Error: {error}</p>}

      <div className="slider-container">
        <label htmlFor="radius-slider">
          Search Radius:
        </label>
        <span className="radius-value">{radius} km</span>
        <input
          id="radius-slider"
          type="range"
          min="1"
          max="20"
          step="1"
          value={radius}
          onChange={(e) => setRadius(parseInt(e.target.value, 10))}
        />
      </div>

      <div className = "map-container">
        <LoadScript googleMapsApiKey={mapsApiKey}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={
              location.lat && location.lng
                ? { lat: location.lat, lng: location.lng }
                : defaultCenter
            }
            zoom={12}
            onClick={handleMapClick}
          >
            {location.lat && location.lng && (
              <Marker position={{ lat: location.lat, lng: location.lng }} />
            )}
          </GoogleMap>
        </LoadScript>
      </div>

      <h2>Supported Stores Nearby</h2>
      {supportedStores.length > 0 ? (<>
        <p>Found supported stores:</p>
        <ul>
          {supportedStores.map((store, index) => (
            <li key={index}>{store}</li>
          ))}
        </ul>
     </> ) : (
        <p>No supported stores found nearby.</p>
      )}

      <h2>Other Nearby Stores</h2>
      <p>You might want to manually check these stores for lower prices. These stores don't have an API or are not supported yet.</p>
      <ul>
        {unsupportedStores.map((store, index) => (
          <li key={index}>{store}</li>
        ))}
      </ul>
    </div>
  );
}

export default ChangeLocation;