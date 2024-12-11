import { IonApp, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { homeOutline, fileTrayStackedOutline, cartOutline, personCircleOutline } from "ionicons/icons";
import { Route, Redirect } from "react-router";
import './PageTabs.css';
import Home from "../../pages/Home";
import Category from "../../pages/Category";
import SubCategory from "../../pages/SubCategory";
import Product from "../../pages/Product";
import Search from "../../pages/Search";
import Login from "../../pages/Login";
import Register from "../../pages/Register";
import ForgotPassword from "../../pages/ForgotPassword";
import Setting from "../../pages/Setting";
import Account from "../../pages/Account";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import SpecialProduct from "../../pages/SpecialProduct";
import { useCartContext } from "../../context/CartProvider";
import BillingAddress from "../../pages/BillingAddress";
import BillingInformation from "../../pages/BillingInformation";
import Orders from "../../pages/Orders";
import OrderDetail from "../../pages/OrderDetail";
import { Network } from '@capacitor/network';
import NoNetwork from "../NoNetwork";
import Contact from "../../pages/Contact";
import Cart2 from "../../pages/Cart/Cart2";
import Product2 from "../../pages/Product/Product2";
import ProductDetail2 from "../../pages/ProductDetail/ProductDetail2";
import PreviouslyOrderedProduct from "../../pages/PreviouslyOrderedProduct";
import Promotion from "../../pages/Promotion";

const PageTabs: React.FC = () => {

  const {auth} = useAuth();
  const { cart } = useCartContext();
  const [hasNetwork, setHasNetwork] = useState<boolean>(true);
  
  useEffect(()=>{
    let isMounted = true;
    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
      setHasNetwork(status.connected);
    };
    if(isMounted){
      Network.addListener('networkStatusChange', async (status) => await logCurrentNetworkStatus());
      logCurrentNetworkStatus()
    }

    return () => {
      Network.removeAllListeners()
      isMounted=false;
    }
  }, [])

  if(!hasNetwork) {
    return <NoNetwork />
  }

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/home" component={Home}></Route>
            <Route exact path="/category" component={Category}></Route>
            <Route exact path="/sub-category" component={SubCategory}></Route>
            <Route exact path="/product" component={Product}></Route>
            <Route exact path="/main-product" component={Product2}></Route>
            <Route exact path="/product-detail/:slug" component={ProductDetail2}></Route>
            <Route exact path="/search" component={Search}></Route>
            <Route exact path="/cart" component={Cart2}></Route>
            <Route exact path="/special-product/:slug" component={SpecialProduct}></Route>
            <Route exact path="/register" component={Register}></Route>
            <Route exact path="/forgot-password" component={ForgotPassword}></Route>
            <Route exact path="/account" component={auth.authenticated ? Account : Login}></Route>
            <Route exact path="/setting" component={Setting}></Route>
            <Route exact path="/contact" component={Contact}></Route>
            <Route exact path="/promotion" component={Promotion}></Route>
            <Route exact path="/billing-address" component={BillingAddress}></Route>
            <Route exact path="/billing-information" component={BillingInformation}></Route>
            <Route exact path="/orders" component={Orders}></Route>
            <Route exact path="/order/:slug" component={OrderDetail}></Route>
            <Route exact path="/recently-ordered" component={PreviouslyOrderedProduct}></Route>
            <Route exact path="/">
              <Redirect to="/home" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton className='main-tabs' tab="home" href="/home">
              <IonIcon icon={homeOutline} />
              <IonLabel>Home</IonLabel>
            </IonTabButton>

            <IonTabButton className='main-tabs' tab="products" href="/main-product">
              <IonIcon icon={fileTrayStackedOutline} />
              <IonLabel>Products</IonLabel>
            </IonTabButton>

            <IonTabButton className='main-tabs' tab="cart" href="/cart">
              <>
                <IonIcon icon={cartOutline} />
                <IonBadge color="dark">{cart.cart.length}</IonBadge>
              </>
              <IonLabel>Cart</IonLabel>
            </IonTabButton>

            <IonTabButton className='main-tabs' tab="account" href="/account">
              <IonIcon icon={personCircleOutline} />
              <IonLabel>Account</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}

export default PageTabs;