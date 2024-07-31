import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/react';
import './SpecialProductSection.css';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback, useRef, useState } from 'react';
import { ProductType } from '../../helper/types';
import { api_routes } from '../../helper/routes';
import useSWRInfinite from "swr/infinite";
import LoadingCard from '../../components/LoadingCard';
import ShowMoreButton from '../ShowMoreButton';
import MainProductCard from '../MainProductCard';
import NoData from '../NoData';

const PAGE_SIZE = 20;

type Props = {
    inHomePage?: boolean;
    slug?: "is_featured" | "is_new" | "is_on_sale";
    name?: string;
}

const SpecialProductSection: React.FC<Props> = ({inHomePage=true, slug, name}) => {
    const axiosPrivate = useAxiosPrivate();

    const productRef = useRef<HTMLIonInfiniteScrollElement | null>(null);

    const fetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        setTimeout(async() => {
          if(productRef && productRef.current){
            await productRef.current.complete()
          }
        }, 500)
        return res.data.data
    };

    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        setTimeout(async() => {
            if(productRef && productRef.current){
              await productRef.current.complete()
            }
        }, 500)
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
            {
                (data ? data.flat(): []).map((item, i) => <MainProductCard {...item} key={i} />)
            }
            {
                (isLoading) && <LoadingCard itemCount={6} column={12} />
            }
            {
                (!isLoading && data && data.flat().length===0) && <NoData message='No product is available!' />
            }
            {
                inHomePage ? <ShowMoreButton link={`/special-product/${slug}`} /> : 
                <IonInfiniteScroll
                    ref={productRef}
                    onIonInfinite={(ev) => {
                        if (ev.target.scrollTop + ev.target.offsetHeight>= ev.target.scrollHeight ){
                            !isLoading && setSize(size+1);
                        }
                    }}
                >
                    <IonInfiniteScrollContent loadingText="Please wait..." loadingSpinner="bubbles"></IonInfiniteScrollContent>
                </IonInfiniteScroll>
            }
        </>
    );
};

export default SpecialProductSection;
