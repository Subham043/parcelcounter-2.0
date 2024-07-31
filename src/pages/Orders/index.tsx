import { IonContent, IonPage, IonRefresher, IonRefresherContent, RefresherEventDetail } from '@ionic/react';
import './Orders.css';
import MainHeader from '../../components/MainHeader';
import { api_routes } from '../../helper/routes';
import { useCallback } from 'react';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useAuth } from '../../context/AuthProvider';
import useSWRInfinite from "swr/infinite";
import { OrderType } from '../../helper/types';
import LoadingCard from '../../components/LoadingCard';
import OrderCard from '../../components/OrderCard';
import NoData from '../../components/NoData';
import InfiniteScroll from 'react-infinite-scroll-component';

const PAGE_SIZE = 20;

const Orders: React.FC = () =>{
    const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();
    const fetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        return res.data.data
    };
    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        if(!auth.authenticated) return null;
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) return null;
        return `${api_routes.place_order_paginate_success}?total=${PAGE_SIZE}&page=${pageIndex+1}`;
    }, [])
    const {
        data,
        mutate,
        size,
        setSize,
        isLoading
    } = useSWRInfinite<OrderType>(getKey, fetcher,{
        initialSize:1,
        revalidateAll: false,
        revalidateFirstPage: false,
        persistSize: false,
        parallel: false
    });
    return <IonPage>
        <MainHeader isMainHeader={false} name='orders' />
        <IonContent
          fullscreen={false}
          forceOverscroll={false}
        >
            <IonRefresher slot="fixed" onIonRefresh={(event: CustomEvent<RefresherEventDetail>)=>{
                setTimeout(() => {
                    // Any calls to load data go here
                    auth.authenticated && mutate();
                    event.detail.complete();
                }, 1500);
            }}>
                <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            {
                (isLoading && data===undefined) && <LoadingCard itemCount={6} column={12} />
            }
            {
                (!isLoading && data && data.flat().length===0) && <NoData message='No order is available!' />
            }
            <div className="order-card-wrapper scroll-freeze page-padding mt-1" id='orderScrollableDiv'>
                <InfiniteScroll
                    dataLength={(!isLoading && data && data.length>0) ? data.flat().length : 0}
                    next={() => {
                        !isLoading ? setSize(size+1) : null
                    }}
                    hasMore={true}
                    loader={isLoading ? <LoadingCard itemCount={6} column={12} /> : null}
                    scrollableTarget="orderScrollableDiv"
                    style={{height:'100%'}}
                >    
                    {
                        (data ? data.flat(): []).map((item, i) => <OrderCard {...item} key={i} />)
                    }
                </InfiniteScroll>
            </div>
        </IonContent>
    </IonPage>
}

export default Orders;