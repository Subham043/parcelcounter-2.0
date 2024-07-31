import LoadingCard from '../../components/LoadingCard';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback } from 'react';
import { api_routes } from '../../helper/routes';
import useSWRInfinite from "swr/infinite";
import { ProductType } from '../../helper/types';
import NoData from '../NoData';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import './PreviouslyOrdered.css';
import PreviouseOrderItem from '../PreviousOrderItem';
import { useAuth } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { chevronForwardOutline } from 'ionicons/icons';

const PAGE_SIZE = 20;

const PreviouslyOrdered: React.FC = () => {
    const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();

    const fetcher = useCallback(
        async (url: string) => {
          if(auth.authenticated){
            const headers = {
              headers: {
                "Authorization" : `Bearer ${auth.token}`,
                "Accept": 'application/json'
              }
            }
            const res =  await axiosPrivate.get(url,headers)
            return res.data.data;
          }
          return undefined;
        },
        [auth],
    );
    
    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        if(!auth.authenticated) return null;
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) return null;
        return `${api_routes.latest_order_item}?total=${PAGE_SIZE}&page=${pageIndex+1}`;
    }, [auth.authenticated])
    
    const {
        data,
        size,
        setSize,
        isLoading
    } = useSWRInfinite<ProductType>(getKey, fetcher,{
        initialSize:1,
        revalidateAll: false,
        revalidateFirstPage: false,
        persistSize: false,
        parallel: false
    });
    
    return (
        (auth.authenticated && (data ? data.flat(): []).length>0) && <>
            <div className="page-padding row-header">
                <h3>Recently Ordered</h3>
                <Link to='/recently-ordered'><span>Show More</span> <IonIcon icon={chevronForwardOutline} /></Link>
            </div>
            <div className='page-padding slider-padding'>
                <div className="main-product-slider main-previous-order-slider">
                    {
                        (isLoading) && <LoadingCard itemCount={1} column={12} height='300px' />
                    }
                    {
                        (!isLoading && data && data.flat().length===0) && <NoData message='No product is available!' />
                    }
                    <Swiper
                        modules={[Pagination]}
                        autoplay={false}
                        keyboard={false}
                        slidesPerView={'auto'}
                        centeredSlides={false}
                        pagination={false}
                        spaceBetween={10}
                        scrollbar={false}
                        zoom={false}
                        onSlideNextTransitionEnd={(swiper)=>((data ? data.flat() : []).length>0 && (swiper.activeIndex+1)>=((data ? data.flat() : []).length/2)) && setSize(size+1)}
                    >
                        {
                            (data ? data.flat() : []).map((item, i) => <SwiperSlide key={i}>
                                <PreviouseOrderItem {...item} />
                            </SwiperSlide>)
                        }
                    </Swiper>
                </div>
            </div>
        </>
    );
};

export default PreviouslyOrdered;
