import { useAuth } from "../../context/AuthProvider";
import { Route, RouteProps } from "react-router";
import Login from "../../pages/Login";
import { AuthType } from "../../helper/types";


const ProtectedRoute = ({component: Component, ...rest}: RouteProps & AuthType) => {
    const { path, exact, authenticated } = {...rest};
    console.log(authenticated);
    
    return <Route exact={exact} path={path} component={authenticated ? Component : Login}></Route>;
    
}
export default ProtectedRoute