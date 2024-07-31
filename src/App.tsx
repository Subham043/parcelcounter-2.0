import { setupIonicReact } from '@ionic/react';
import PageTabs from './components/PageTabs';
import AuthProvider from './context/AuthProvider';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import 'react-toastify/dist/ReactToastify.css';

import 'swiper/css';
import '@ionic/react/css/ionic-swiper.css';
import 'swiper/css/autoplay';
import 'swiper/css/keyboard';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/zoom';

/* Theme variables */
import './theme/variables.css';
import './theme/global.css';
import SwrLayout from './layout/SwrLayout';
import { ToastContainer } from 'react-toastify';
import CartProvider from './context/CartProvider';
import BasicCartProvider from './context/BasicCartProvider';

setupIonicReact();

const App: React.FC = () => <AuthProvider>
  <SwrLayout>
    <BasicCartProvider>
      <CartProvider>
        <PageTabs />
        <ToastContainer />
      </CartProvider>
    </BasicCartProvider>
  </SwrLayout>
</AuthProvider>

export default App;
