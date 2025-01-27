import { useContext } from "react";
import { AuthContext } from '../Contexts/AuthContext';
import UserLogin from '../components/forms/UserLogin'
import PropTypes from "prop-types";


const ProtectAdminRoutes = ({children}) => {

    const { userData } = useContext(AuthContext)    

    if (!userData.isLoggedIN){
        return <UserLogin />
    } 
    else if (!userData.user.isAdmin) {
        return <h1 className="text-center p-5"> أنت غير مصرح بدخول هذه الصفحة! </h1>
    } 
    else {
        return children
    }
}

export default ProtectAdminRoutes


ProtectAdminRoutes.propTypes = {
    children: PropTypes.node.isRequired,
  };
