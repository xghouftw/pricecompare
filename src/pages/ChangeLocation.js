import React, { useState, useEffect, useContext } from 'react';
import { searchNearbyPlaces } from '../services/GoogleNearbySearch';
import { searchLocations as searchKrogerLocations } from '../services/KrogerLocation';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { StoreAvailabilityContext } from '../components/StoreAvailabilityContext';

const mapsApiKey=process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

function ChangeLocation() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [stores, setStores] = useState([]);
  const [error, setError] = useState(null);
  const [unsupportedStores, setUnsupportedStores] = useState([]);

  const { apiList, setApiList } = useContext(StoreAvailabilityContext);
  const { krogerLocations, setKrogerLocations } = useContext(StoreAvailabilityContext);

  const mapContainerStyle = {
    width: '800px',
    height: '400px'
  };
  
  const defaultCenter = {
    lat: 0,
    lng: 0
  };
  
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
        setError('Error in retrieving location');
        console.error(err);
      }
    );
  };

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
              const data = await searchKrogerLocations(`${location.lat},${location.lng}`);
              setKrogerLocations(data);
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
    <div>
      <h2>Change Location</h2>

      <button onClick = {handleDetectLocation}>
        Automatically detect my location
      </button>

      {location.lat && location.lng ? (
        <p>
          Detected your location at latitude: {location.lat}, longitude: {location.lng}
        </p>
      ) : (
        <p>No location detected yet.</p>
      )}
      <p>Or, manually click the location marker on the map.</p>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

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