import './SpecialProductSection.css';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback } from 'react';
import { ProductType } from '../../helper/types';
import { api_routes } from '../../helper/routes';
import useSWRInfinite from "swr/infinite";
import LoadingCard from '../../components/LoadingCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import MainProductCard from '../MainProductCard';
import RowHeading from '../RowHeading';
import NoData from '../NoData';

const PAGE_SIZE = 20;

type Props = {
    inHomePage?: boolean;
    slug?: "is_featured" | "is_new" | "is_on_sale";
    name?: string;
}

const SpecialProductSliderSection: React.FC<Props> = ({inHomePage=true, slug, name}) => {
    const axiosPrivate = useAxiosPrivate();
    const fetcher = (url: string) => axiosPrivate.get(url).then((res) => res.data.data);
    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) return null;
        return `${api_routes.products}?total=${PAGE_SIZE}&page=${pageIndex+1}&sort=id${slug ? `&filter[${slug}]=true` : ''}`;
    }, [slug])
    
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
        <>
            <RowHeading text={name ? name : ''} link={`/special-product/${slug}`} inHomePage={true} />
            <div className='page-padding slider-padding section-container'>
                <div className="main-product-slider">
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
                                <MainProductCard {...item} />
                            </SwiperSlide>)
                        }
                    </Swiper>
                </div>
            </div>
        </>
    );
};

export default SpecialProductSliderSection;
