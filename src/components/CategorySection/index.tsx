import { IonCol, IonInfiniteScroll, IonInfiniteScrollContent, IonRow } from '@ionic/react';
import './CategorySection.css';
import LoadingCard from '../../components/LoadingCard';
import { api_routes } from '../../helper/routes';
import { CategoryType } from '../../helper/types';
import CategoryCard2 from '../CategoryCard/CategoryCard2';
import RowHeading from '../RowHeading';
import NoData from '../NoData';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback, useRef } from 'react';
import useSWRInfinite from "swr/infinite";

const PAGE_SIZE = 12;

const CategorySection: React.FC<{inHomePage?:boolean}> = ({inHomePage=true}) => {

    const axiosPrivate = useAxiosPrivate();
    const categoryRef = useRef<HTMLIonInfiniteScrollElement | null>(null);
    const categoryFetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        setTimeout(async() => {
            if(categoryRef && categoryRef.current){
                await categoryRef.current.complete()
            }
        }, 500)
        return res.data.data
    };
    const getCategoryKey = useCallback((pageIndex:any, previousPageData:any) => {
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)){ 
            if(categoryRef && categoryRef.current){
                categoryRef.current.complete()
            }
            return null;
        }
        return `${api_routes.categories}?total=${PAGE_SIZE}&page=${pageIndex+1}&sort=name`;
    }, [])
    
    const {
        data,
        size,
        setSize,
        isLoading
    } = useSWRInfinite<CategoryType>(getCategoryKey, categoryFetcher,{
        initialSize:1,
        revalidateAll: false,
        revalidateFirstPage: false,
        persistSize: false,
        parallel: false
    });

    return (
        <>
            <RowHeading text='What are you looking for?' link='/main-product' inHomePage={inHomePage} />
            <div className={`page-padding section-container`}>
                {
                    (isLoading && data===undefined) && <LoadingCard itemCount={6} column={4} />
                }
                {
                    (!isLoading && data && data.flat().length===0) && <NoData message='No category is available!' />
                }
                <IonRow className="ion-align-items-start ion-justify-content-start mb-2">
                    {
                        (data ? data.flat(): []).map((item, i) =>  <IonCol
                            size="6"
                            size-xl="3"
                            size-lg="3"
                            size-md="3"
                            size-sm="3"
                            size-xs="3"
                            key={i}
                        >
                            <CategoryCard2 image={item.image} text={item.name} link={item.sub_categories.length>0 ? `/main-product?category=${item.id}` : `/main-product?category=${item.id}`}  />
                        </IonCol>)
                    }
                    <IonInfiniteScroll
                        ref={categoryRef}
                        onIonInfinite={(ev) => {
                            if (ev.target.scrollTop + ev.target.offsetHeight>= ev.target.scrollHeight ){
                                !isLoading && setSize(size+1);
                            }
                        }}
                    >
                        <IonInfiniteScrollContent></IonInfiniteScrollContent>
                    </IonInfiniteScroll>
                </IonRow>
            </div>
        </>
    );
};

export default CategorySection;
