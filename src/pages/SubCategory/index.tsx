import { IonCol, IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage, IonRow } from '@ionic/react';
import './SubCategory.css';
import MainHeader from '../../components/MainHeader';
import { CategoryType, SubCategoryType } from '../../helper/types';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback, useRef, useState } from 'react';
import { api_routes } from '../../helper/routes';
import useSWRInfinite from "swr/infinite";
import LoadingCard from '../../components/LoadingCard';
import { useLocation } from 'react-router';
import useSWR from 'swr'
import CategoryCard2 from '../../components/CategoryCard/CategoryCard2';
import ViewCartBtn from '../../components/ViewCartBtn';
import NoData from '../../components/NoData';

const PAGE_SIZE = 20;

const SubCategory: React.FC = () => {
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const category_slug = query.get('category_slug')
    const axiosPrivate = useAxiosPrivate();
    const { data:categoryData, isLoading:isCategoryLoading } = useSWR<{category: CategoryType}>(category_slug ? api_routes.categories + `/${category_slug}` : null);
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
        return `${api_routes.sub_categories}?total=${PAGE_SIZE}&page=${pageIndex+1}&sort=id${categoryData ? '&filter[has_categories]='+categoryData.category.id : ''}`;
    }, [categoryData])

    
    const {
        data,
        size,
        setSize,
        isLoading
    } = useSWRInfinite<SubCategoryType>(getKey, fetcher,{
        initialSize:1,
        revalidateAll: false,
        revalidateFirstPage: false,
        persistSize: false,
        parallel: false
    });

    return (
        <IonPage>
            <MainHeader isMainHeader={false} name={categoryData ? categoryData.category.name : ''} />
            <IonContent
                fullscreen={false}
                forceOverscroll={false}
            >
                <div className='page-padding mt-1'>
                    <IonRow className="ion-align-items-start ion-justify-content-center">
                        {
                            (data ? data.flat(): []).map((item, i) => <IonCol
                                size="6"
                                size-xl="3"
                                size-lg="3"
                                size-md="4"
                                size-sm="4"
                                size-xs="4"
                                key={i}
                            >
                                <CategoryCard2 image={item.image} link={`/product?sub_category_slug=${item.slug}`} text={item.name} />
                            </IonCol>)
                        }
                    </IonRow>
                    {
                        (isLoading || isCategoryLoading) && <LoadingCard itemCount={6} column={4} />
                    }
                    {
                        (!isLoading && data && data.flat().length===0) && <NoData message='No sub-category is available!' />
                    }
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
                </div>
                <ViewCartBtn />
            </IonContent>
        </IonPage>
    );
};

export default SubCategory;
