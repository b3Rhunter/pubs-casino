import PropTypes from 'prop-types';
import { createContext, useContext, useState } from 'react';

const CreditsContext = createContext();

export const useCredits = () => useContext(CreditsContext);

export const CreditsProvider = ({ children }) => {
    const [credits, setCredits] = useState(10);

    return (
        <CreditsContext.Provider value={{ credits, setCredits }}>
            {children}
        </CreditsContext.Provider>
    );
};

CreditsProvider.propTypes = {
     children: PropTypes.node.isRequired,
};