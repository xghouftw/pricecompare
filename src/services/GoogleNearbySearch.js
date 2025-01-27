const mapsApiKey=process.env.REACT_APP_GOOGLE_MAPS_API_KEY

export async function searchNearbyPlaces(lat, lng) {
  const requestBody = {
    includedTypes: ["grocery_store"],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: { latitude: lat, longitude: lng },
        radius: 5000
      }
    }
  };

  const url = new URL("https://places.googleapis.com/v1/places:searchNearby");
  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": mapsApiKey,
        "X-Goog-FieldMask": "places.displayName" 
      },
      body: JSON.stringify(requestBody)
    });


    if (!response.ok) {
      throw new Error(`Nearby search failed with status ${response.statusText}`);
    }

    const data = await response.json();
    const placeNames = data.places
    ? data.places.map((place) => place.displayName.text.trim())
    : [];

    const uniquePlaceNames = [...new Set(placeNames)];

    return uniquePlaceNames;
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    throw error;
  }
}