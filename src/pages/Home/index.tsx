import { IonContent, IonPage } from '@ionic/react';
import './Home.css';
import MainHeader from '../../components/MainHeader';
import CategorySection from '../../components/CategorySection';
import Slider from '../../components/Slider';
import ViewCartBtn from '../../components/ViewCartBtn';
import PreviouslyOrdered from '../../components/PreviouslyOrdered';

const images = [
  '/images/banner-0001.webp',
  '/images/banner-0002.webp',
  '/images/banner-0003.webp',
  '/images/banner-0004.webp',
  '/images/banner-0005.webp',
  '/images/banner-0006.webp',
];

const Home: React.FC = () => {
  return (
    <IonPage>
        <MainHeader isMainHeader={true} />
        <IonContent
          fullscreen={false}
          forceOverscroll={false}
        >
            <div className='home-slider'>
              <Slider images={images} />
            </div>
            <PreviouslyOrdered />
            <CategorySection inHomePage={true} />
            {/* <SpecialProductSliderSection slug='is_featured' name='Exclusive Products' />
            <SpecialProductSliderSection slug='is_new' name='Eco-Friendly Products' />
            <SpecialProductSliderSection slug='is_on_sale' name='On Demand Products' /> */}
            <ViewCartBtn />
        </IonContent>
    </IonPage>
  );
};

export default Home;
