import { IonContent, IonInfiniteScroll, IonInfiniteScrollContent, IonPage } from '@ionic/react';
import './Product.css';
import MainHeader from '../../components/MainHeader';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback, useRef, useState } from 'react';
import { CategoryType, ProductType, SubCategoryType } from '../../helper/types';
import { api_routes } from '../../helper/routes';
import useSWRInfinite from "swr/infinite";
import LoadingCard from '../../components/LoadingCard';
import { useLocation } from 'react-router';
import useSWR from 'swr'
import MainProductCard from '../../components/MainProductCard';
import ViewCartBtn from '../../components/ViewCartBtn';
import NoData from '../../components/NoData';

const PAGE_SIZE = 20;

const Product: React.FC = () => {
    const location = useLocation()
    const query = new URLSearchParams(location.search)
    const category_slug = query.get('category_slug')
    const sub_category_slug = query.get('sub_category_slug')
    const axiosPrivate = useAxiosPrivate();
    const { data:categoryData, isLoading:isCategoryLoading } = useSWR<{category: CategoryType}>(category_slug ? api_routes.categories + `/${category_slug}` : null);
    const { data:subCategoryData, isLoading:isSubCategoryLoading } = useSWR<{subCategory: SubCategoryType}>(sub_category_slug ? api_routes.sub_categories + `/${sub_category_slug}` : null);
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
        if(!categoryData && !subCategoryData) return null;
        setTimeout(async() => {
            if(productRef && productRef.current){
              await productRef.current.complete()
            }
        }, 500)
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) return null;
        return `${api_routes.products}?total=${PAGE_SIZE}&page=${pageIndex+1}&sort=id${categoryData ? '&filter[has_categories]='+categoryData.category.id : ''}${subCategoryData ? '&filter[has_sub_categories]='+subCategoryData.subCategory.id : ''}`;
    }, [categoryData, subCategoryData])
    
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
            <MainHeader isMainHeader={false} name={categoryData ? categoryData.category.name : subCategoryData ? subCategoryData.subCategory.name: 'Products'} />
            <IonContent
            fullscreen={false}
            forceOverscroll={false}
            >
                {
                    (data ? data.flat(): []).map((item, i) => <MainProductCard {...item} key={i} />)
                }
                {
                    (isLoading || isCategoryLoading || isSubCategoryLoading) && <LoadingCard itemCount={3} column={12} height='300px' />
                }
                {
                    (!isLoading && data && data.flat().length===0) && <NoData message='No product is available!' />
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
                <ViewCartBtn />
            </IonContent>
        </IonPage>
    );
};

export default Product;