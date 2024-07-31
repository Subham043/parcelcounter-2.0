import { IonCol, IonContent, IonPage, IonRow } from '@ionic/react';
import MainHeader from '../../components/MainHeader';
import ViewCartBtn from '../../components/ViewCartBtn';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback, useEffect } from 'react';
import { api_routes } from '../../helper/routes';
import { CategoryType } from '../../helper/types';
import useSWRInfinite from 'swr/infinite';
import LoadingCard from '../../components/LoadingCard';
import NoData from '../../components/NoData';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategoryCard2 from '../../components/CategoryCard/CategoryCard2';

const PAGE_SIZE = 15;

const Category: React.FC = () => {
    const axiosPrivate = useAxiosPrivate();

    const fetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        return res.data.data
    };
    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) return null;
        return `${api_routes.categories}?total=${PAGE_SIZE}&page=${pageIndex+1}&sort=id`;
    }, [])
    
    const {
        data,
        size,
        setSize,
        isLoading,
    } = useSWRInfinite<CategoryType>(getKey, fetcher,{
        initialSize:1,
        revalidateAll: false,
        revalidateFirstPage: false,
        persistSize: false,
        parallel: true,
        revalidateIfStale: true,
        revalidateOnMount: true,
    });

return <IonPage>
        <MainHeader isMainHeader={false} name='Categories' />
        <IonContent
            fullscreen={false}
            forceOverscroll={false}
        >
            <div className={`page-padding section-container scroll-freeze`} id="categorySectionHomeScrollableDiv">
                {
                    (isLoading && data===undefined) && <LoadingCard itemCount={6} column={4} />
                }
                {
                    (!isLoading && data && data.flat().length===0) && <NoData message='No category is available!' />
                }
                <InfiniteScroll
                    dataLength={(!isLoading && data && data.length>0) ? data.flat().length : 0}
                    next={() => {
                        !isLoading ? setSize(size+1) : null
                    }}
                    hasMore={true}
                    loader={isLoading ? <LoadingCard itemCount={6} column={4} /> : null}
                    scrollableTarget="categorySectionHomeScrollableDiv"
                    style={{height:'100%'}}
                >
                    <IonRow className="ion-align-items-start ion-justify-content-start mb-2">
                        {
                            (data ? data.flat(): []).map((item, i) =>  <IonCol
                                size="6"
                                size-xl="3"
                                size-lg="3"
                                size-md="4"
                                size-sm="4"
                                size-xs="4"
                                key={i}
                            >
                                <CategoryCard2 image={item.image} text={item.name} link={item.sub_categories.length>0 ? `/sub-category?category_slug=${item.slug}` : `/product?category_slug=${item.slug}`}  />
                            </IonCol>)
                        }
                    </IonRow>
                </InfiniteScroll>
            </div>
            <ViewCartBtn />
        </IonContent>
    </IonPage>
}

export default Category;
