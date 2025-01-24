import React, { createContext, useState } from 'react';
import SUPPORTED_STORES from './SupportedStores';

const StoreAvailabilityContext = createContext();

const StoreAvailabilityContextProvider = ({ children }) => {
    const [apiList, setApiList] = useState(
        SUPPORTED_STORES.map((store) => ({
          name: store,
          enabled: false,
        }))
    );

    const [krogerLocations, setKrogerLocations] = useState([]);

    return (
        <StoreAvailabilityContext.Provider
          value={{
            apiList,
            setApiList,
            krogerLocations,
            setKrogerLocations
          }}
        >
          {children}
        </StoreAvailabilityContext.Provider>
    );
}

export { StoreAvailabilityContext, StoreAvailabilityContextProvider };