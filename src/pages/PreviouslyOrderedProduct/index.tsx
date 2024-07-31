import { IonContent, IonPage } from '@ionic/react';
import MainHeader from '../../components/MainHeader';
import ViewCartBtn from '../../components/ViewCartBtn';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback, useRef } from 'react';
import { api_routes } from '../../helper/routes';
import useSWRInfinite from 'swr/infinite';
import { ProductType } from '../../helper/types';
import MainProductCard from '../../components/MainProductCard';
import LoadingCard from '../../components/LoadingCard';
import NoData from '../../components/NoData';
import { useAuth } from '../../context/AuthProvider';
import InfiniteScroll from 'react-infinite-scroll-component';

const PAGE_SIZE = 20;

const PreviouslyOrderedProduct: React.FC = () => {

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
        <IonPage>
            <MainHeader isMainHeader={false} name={'Recently Ordered'} />
            <IonContent
            fullscreen={false}
            forceOverscroll={false}
            >
                {
                    (isLoading && data===undefined) && <LoadingCard itemCount={6} column={12} />
                }
                {
                    (!isLoading && data && data.flat().length===0) && <NoData message='No product is available!' />
                }
                <div className="scroll-freeze" id="recentOrderScrollableDiv">
                    <InfiniteScroll
                        dataLength={(!isLoading && data && data.length>0) ? data.flat().length : 0}
                        next={() => {
                            !isLoading ? setSize(size+1) : null
                        }}
                        hasMore={true}
                        loader={isLoading ? <LoadingCard itemCount={6} column={12} /> : null}
                        scrollableTarget="recentOrderScrollableDiv"
                        style={{height:'100%'}}
                    >
                        {
                            (data ? data.flat(): []).map((item, i) => <MainProductCard {...item} key={i} />)
                        }
                    </InfiniteScroll>
                </div>
                <ViewCartBtn />
            </IonContent>
        </IonPage>
    );
};

export default PreviouslyOrderedProduct;
