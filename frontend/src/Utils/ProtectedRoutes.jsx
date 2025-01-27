import { useContext } from "react";
import { AuthContext } from '../Contexts/AuthContext';
import PropTypes from "prop-types";
import UserLogin from "../components/forms/UserLogin";


const ProtectedRoutes = ({children}) => {

    const { userData } = useContext(AuthContext)
    
    return userData.isLoggedIN ? children : <UserLogin />
}

export default ProtectedRoutes


ProtectedRoutes.propTypes = {
    children: PropTypes.node.isRequired
}