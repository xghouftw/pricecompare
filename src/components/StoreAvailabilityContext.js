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

    const [supportedStores, setSupportedStores] = useState([]);
    const [krogerLocations, setKrogerLocations] = useState([]);

    return (
        <StoreAvailabilityContext.Provider
          value={{
            apiList,
            setApiList,
            krogerLocations,
            setKrogerLocations,
            supportedStores,
            setSupportedStores
          }}
        >
          {children}
        </StoreAvailabilityContext.Provider>
    );
}

export { StoreAvailabilityContext, StoreAvailabilityContextProvider };