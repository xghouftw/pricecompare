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

  const { apiList, setApiList, setKrogerLocations } = useContext(StoreAvailabilityContext);

  const mapContainerStyle = { width: '800px', height: '400px'};
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

  // Detect location on loading page and kick server on
  useEffect(() => {
    handleDetectLocation();
  }, []); 

  useEffect(() => {
    if (location.lat && location.lng) {
      const fetchNearbyStores = async () => {
        try {
          const nearbyStores = await searchNearbyPlaces(location.lat, location.lng);
          setStores(nearbyStores);
        } catch (err) {
          setError("Error fetching nearby places");
          console.error(err);
        }
      };

      fetchNearbyStores();
    }
  }, [location]);

  useEffect(() => {
    let newApiList = [...apiList];
    const unsupported = [];

    for (let j = 0; j < newApiList.length; j++) newApiList[j].enabled = false;

    if (stores.length > 0) {
      for (let i = 0; i < stores.length; i++) {
        let supported = false;
        for (let j = 0; j < newApiList.length; j++) {
          if (stores[i].toLowerCase().includes(newApiList[j].name.toLowerCase())) {
            newApiList[j].enabled = true;
            supported = true;
          } 
        }
        if (!supported) {
          unsupported.push(stores[i]);
        }
      }
    }

    if (location.lat && location.lng) {
      for (let i = 0; i < apiList.length; i++) {
        if (apiList[i].name == "Kroger") {
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
      <p>When searching for an item, we can automatically compare price tags across these major retailers!</p>
      <ul>
        {apiList.filter(api => api.enabled).map((api, index) => (
          <li key={index}>{api.name}</li>
        ))}
      </ul>

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