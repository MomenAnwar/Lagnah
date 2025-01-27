import PropTypes from "prop-types";
import { createContext, useState } from "react";


export const SetSelected = createContext()

export const SetSelectedProvider = ({ children }) => {
    const [selectedNav, setSelectedNav] = useState('')
    const [selectedDash, setSelectedDash] = useState('')
    
    const setSelectedNavbar = (data) => {
        setSelectedNav(data)
    }

    const setSelectedDashboard = (data) => {
        setSelectedDash(data)
    }

    return (
        <SetSelected.Provider value={{ selectedNav, selectedDash, setSelectedNavbar, setSelectedDashboard }}>
            {children}
        </SetSelected.Provider>
    )
}

SetSelectedProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };
