import { IonCardHeader, IonCol, IonContent, IonImg, IonPage, IonRow, IonSpinner, IonText, useIonRouter } from '@ionic/react';
import './Product.css';
import MainHeader from '../../components/MainHeader';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CategoryType, ProductType, SubCategoryType } from '../../helper/types';
import { api_routes } from '../../helper/routes';
import useSWRInfinite from "swr/infinite";
import LoadingCard from '../../components/LoadingCard';
import MainProductCard from '../../components/MainProductCard';
import ViewCartBtn from '../../components/ViewCartBtn';
import NoData from '../../components/NoData';
import './Product2.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import { useLocation } from 'react-router';

const PAGE_SIZE = 20;
const CATEGORY_PAGE_SIZE = 10;
const SUB_CATEGORY_PAGE_SIZE = 10;

const Product2: React.FC = () => {
    const axiosPrivate = useAxiosPrivate();
    const location = useLocation();
    const getQueryParams = (search: string) => {
        return new URLSearchParams(search);
    };
    const queryParams = getQueryParams(location.search);
    const [hasSubCategories, setHasSubCategories] = useState<boolean>(false);
    const productRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(productRef && productRef.current){
            productRef.current.scrollTo(0, 0);
        }

        if(queryParams.get('category')){
            setHasSubCategories(true);
        }

        return () => {
            setHasSubCategories(false);
        }
    }, [queryParams.get('category'), queryParams.get('subCategory')])
    
    const fetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        return res.data.data
    };
    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) return null;
        return `${api_routes.products}?total=${PAGE_SIZE}&page=${pageIndex+1}&sort=name${(queryParams.get('category') && queryParams.get('category')!=='All') ? '&filter[has_categories]='+queryParams.get('category') : ''}${(queryParams.get('subCategory') && queryParams.get('subCategory')!=='All') ? '&filter[has_sub_categories]='+queryParams.get('subCategory') : ''}`;
    }, [queryParams.get('category'), queryParams.get('subCategory')])
    
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
            <MainHeader isMainHeader={true} />
            <IonContent
                fullscreen={false}
                forceOverscroll={false}
            >
                <div className='product-2-content-wrapper'>
                    <div className='product-2-category-content-wrapper' id="categoryScrollableDiv">
                        <CategorySelectionSlider selectedCategory={queryParams.get('category') ?? 'All'} setHasSubCategories={setHasSubCategories} />
                    </div>
                    <div className='product-2-product-content-wrapper' id="productScrollableDiv" ref={productRef}>
                        {
                            hasSubCategories ? <SubCategorySelection selectedCategory={queryParams.get('category') ?? 'All'} selectedSubCategory={queryParams.get('subCategory') ?? 'All'} setHasSubCategories={setHasSubCategories} hasSubCategories={hasSubCategories} /> :<>
                            {
                                (isLoading && data===undefined) && <LoadingCard itemCount={3} column={12} height='300px' />
                            }
                            <InfiniteScroll
                                dataLength={(!isLoading && data && data.flat().length>0) ? data.flat().length : 0}
                                next={() => {
                                    !isLoading ? setSize(size+1) : null
                                }}
                                hasMore={true}
                                loader={isLoading ? <LoadingCard itemCount={3} column={12} height='300px' /> : null}
                                scrollableTarget="productScrollableDiv"
                                style={{height:'100%'}}
                            >
                                {
                                    (data ? data.flat(): []).map((item, i) => <MainProductCard {...item} key={i} />)
                                }
                                {
                                    (!isLoading && data && data.flat().length===0) && <NoData message='No product is available!' />
                                }
                            </InfiniteScroll>
                            </>
                        }
                    </div>
                </div>
                
                <ViewCartBtn />
            </IonContent>
        </IonPage>
    );
};

export default Product2;

const CategorySelectionSlider:React.FC<{
    selectedCategory:string;
    setHasSubCategories: React.Dispatch<React.SetStateAction<boolean>>;
}> =({selectedCategory, setHasSubCategories}) => {
    const axiosPrivate = useAxiosPrivate();
    const router = useIonRouter();
    const categoryFetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        return res.data.data
    };
    const getCategoryKey = useCallback((pageIndex:any, previousPageData:any) => {
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<CATEGORY_PAGE_SIZE)) return null;
        return `${api_routes.categories}?total=${CATEGORY_PAGE_SIZE}&page=${pageIndex+1}&sort=name`;
    }, [])
    
    const {
        data:categoryData,
        size:categorySize,
        setSize: setCategorySize,
        isLoading: isCategoryLoading
    } = useSWRInfinite<CategoryType>(getCategoryKey, categoryFetcher,{
        initialSize:1,
        revalidateAll: false,
        revalidateFirstPage: false,
        persistSize: false,
        parallel: false
    });

    const categorySelectionHandler = (category: CategoryType|'All') => {
        if(category==='All'){
            router.push('/main-product');
            setHasSubCategories(false);
        }else{
            router.push('/main-product' + `?category=${category.id}`);
            if(category.sub_categories.length>0){
                setHasSubCategories(true);
            }else{
                setHasSubCategories(false);
            }
        }
    }

    return (
        <>
            {
                (isCategoryLoading && categoryData===undefined) && <LoadingCard itemCount={8} column={12} />
            }
            <InfiniteScroll
                dataLength={(!isCategoryLoading && categoryData && categoryData.flat().length>0) ? categoryData.flat().length : 0}
                next={() => {
                    !isCategoryLoading ? setCategorySize(categorySize+1) : null
                }}
                hasMore={true}
                loader={isCategoryLoading ? <LoadingCard itemCount={8} column={12} /> : null}
                scrollableTarget="categoryScrollableDiv"
                style={{height:'100%'}}
            >
                <div className={selectedCategory==='All' ? 'single-category-item-container single-category-item-container-active' : 'single-category-item-container'} onClick={()=>categorySelectionHandler('All')}>
                    <IonImg
                        src='/images/category-all.webp'
                        alt="Sliders"
                        class='single-category-item-image'
                    />
                    <p className='single-category-item-name'>All</p>
                </div>
                {
                    ((!isCategoryLoading && categoryData && categoryData.flat().length>0) ? categoryData.flat(): []).map((item, i) => <div className={selectedCategory===item.id.toString() ? 'single-category-item-container single-category-item-container-active' : 'single-category-item-container'} key={i} onClick={()=>categorySelectionHandler(item)}>
                        <IonImg
                            src={item.image}
                            alt="Sliders"
                            class='single-category-item-image'
                        />
                        <p className='single-category-item-name'>{item.name}</p>
                    </div>)
                }
            </InfiniteScroll>
        </>
    )
};

const SubCategorySelection:React.FC<{
    selectedCategory:string;
    selectedSubCategory:string;
    hasSubCategories:boolean;
    setHasSubCategories: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({setHasSubCategories, selectedCategory, selectedSubCategory, hasSubCategories}) =>{
    const axiosPrivate = useAxiosPrivate();
    const router = useIonRouter();
    const subCategoryRef = useRef<HTMLDivElement | null>(null);

    const fetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        return res.data.data
    };
    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        if(!hasSubCategories) return null;
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<SUB_CATEGORY_PAGE_SIZE)) return null;
        return `${api_routes.sub_categories}?total=${SUB_CATEGORY_PAGE_SIZE}&page=${pageIndex+1}&sort=name${selectedCategory!=='All' ? '&filter[has_categories]='+selectedCategory : ''}`;
    }, [selectedCategory])

    useEffect(() => {
        if(hasSubCategories && subCategoryRef && subCategoryRef.current){
            subCategoryRef.current.scrollTo(0, 0);
        }
    }, [hasSubCategories])

    
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

    useEffect(() => {
        (selectedCategory==='All' || selectedSubCategory!=='All' || data && data.flat().length===0) ? setHasSubCategories(false) : setHasSubCategories(true);
    }, [selectedCategory, data])

    const subCategorySelectionHandler = (subCategory: SubCategoryType) => {
        router.push('/main-product' + `?category=${selectedCategory}&subCategory=${subCategory.id}`);
        setHasSubCategories(false);
    }

    return <div className='page-padding mt-1 subcategory-content-wrapper'>
        {
            (isLoading && data===undefined) &&  <LoadingCard itemCount={8} column={6} height='160px' />
        }
        <div className='subcategory-content-wrapper-container' id="subCategoryScrollableDiv" ref={subCategoryRef}>
            <InfiniteScroll
                dataLength={(!isLoading && data && data.flat().length>0) ? data.flat().length : 0}
                next={() => {
                    !isLoading ? setSize(size+1) : null
                }}
                hasMore={true}
                loader={isLoading ? <LoadingCard itemCount={3} column={12} height='300px' /> : null}
                scrollableTarget="productScrollableDiv"
                style={{height:'100%'}}
            >
                <IonRow className="ion-align-items-start ion-justify-content-between subcategory-content-wrapper-container">
                    {
                        (data ? data.flat(): []).map((item, i) => <IonCol
                            size="6"
                            size-xl="6"
                            size-lg="6"
                            size-md="6"
                            size-sm="6"
                            size-xs="6"
                            key={i}
                        >
                            <SubCategoryCard {...item} subCategorySelectionHandler={subCategorySelectionHandler} />
                        </IonCol>)
                    }
                </IonRow>
                {
                    (!isLoading && data && data.flat().length===0) && <NoData message='No sub-category is available!' />
                }
            </InfiniteScroll>
        </div>
    </div>
}

const SubCategoryCard: React.FC<SubCategoryType & {subCategorySelectionHandler: (subCategory: SubCategoryType)=>void}> = (props) => 
{
    const [imgLoading, setImgLoading] = useState<boolean>(true);
    return <button className="main-subcategory-card-btn no-underline" onClick={()=>props.subCategorySelectionHandler({...props})}>
        <div className="category-card-2">
            {
                imgLoading &&
                <div className="text-center mt-1">
                    <IonSpinner color='dark' />
                </div>
            }
            <IonImg alt="category" src={props.image} class="category-card-image" onIonImgDidLoad={()=>setImgLoading(false)} />
            <IonCardHeader className="category-card-header">
                <IonText color="dark">
                    <p className="category-card-text">{props.name}</p>
                </IonText>
            </IonCardHeader>
        </div>
    </button>
}