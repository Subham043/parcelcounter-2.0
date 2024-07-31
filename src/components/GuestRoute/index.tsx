import { useAuth } from "../../context/AuthProvider";
import { Route, RouteProps } from "react-router";
import Account from "../../pages/Account";


const GuestRoute = ({component: Component, ...rest}: RouteProps) => {
    const {auth} = useAuth();
    const { path, exact } = {...rest};
    return <Route exact={exact} path={path} component={!auth.authenticated ? Component : Account}></Route>;
    
}
export default GuestRoute