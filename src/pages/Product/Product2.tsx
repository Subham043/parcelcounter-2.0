import { IonCardHeader, IonCol, IonContent, IonImg, IonPage, IonRow, IonSpinner, IonText } from '@ionic/react';
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

const PAGE_SIZE = 20;
const CATEGORY_PAGE_SIZE = 10;
const SUB_CATEGORY_PAGE_SIZE = 10;

const Product2: React.FC = () => {
    const axiosPrivate = useAxiosPrivate();

    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
    const [hasSubCategories, setHasSubCategories] = useState<boolean>(false);
    const productRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if(productRef && productRef.current){
            productRef.current.scrollTo(0, 0);
        }
    }, [selectedCategory, selectedSubCategory])
    
    const fetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        return res.data.data
    };
    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) return null;
        return `${api_routes.products}?total=${PAGE_SIZE}&page=${pageIndex+1}&sort=${selectedCategory==='All' ? 'id' : 'name'}${selectedCategory!=='All' ? '&filter[has_categories]='+selectedCategory : ''}${selectedSubCategory!=='All' ? '&filter[has_sub_categories]='+selectedSubCategory : ''}`;
    }, [selectedCategory, selectedSubCategory])
    
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
                        <CategorySelectionSlider selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} setHasSubCategories={setHasSubCategories} setSelectedSubCategory={setSelectedSubCategory} />
                    </div>
                    <div className='product-2-product-content-wrapper' id="productScrollableDiv" ref={productRef}>
                        {
                            hasSubCategories ? <SubCategorySelection selectedCategory={selectedCategory} setHasSubCategories={setHasSubCategories} setSelectedSubCategory={setSelectedSubCategory} hasSubCategories={hasSubCategories} /> :<>
                            {
                                (isLoading && data===undefined) && <LoadingCard itemCount={3} column={12} height='300px' />
                            }
                            <InfiniteScroll
                                dataLength={(!isLoading && data && data.length>0) ? data.flat().length : 0}
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
    setSelectedCategory:React.Dispatch<React.SetStateAction<string>>;
    setHasSubCategories: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedSubCategory:React.Dispatch<React.SetStateAction<string>>;
}> =({selectedCategory, setSelectedCategory, setHasSubCategories, setSelectedSubCategory}) => {
    const axiosPrivate = useAxiosPrivate();

    const categoryFetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        return res.data.data
    };
    const getCategoryKey = useCallback((pageIndex:any, previousPageData:any) => {
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<CATEGORY_PAGE_SIZE)) return null;
        return `${api_routes.categories}?total=${CATEGORY_PAGE_SIZE}&page=${pageIndex+1}&sort=id`;
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
        setSelectedSubCategory('All')
        if(category==='All'){
            setSelectedCategory('All');
            setHasSubCategories(false);
        }else{
            setSelectedCategory(category.id.toString());
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
                dataLength={(!isCategoryLoading && categoryData && categoryData.length>0) ? categoryData.flat().length : 0}
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
                    ((!isCategoryLoading && categoryData && categoryData.length>0) ? categoryData.flat(): []).map((item, i) => <div className={selectedCategory===item.id.toString() ? 'single-category-item-container single-category-item-container-active' : 'single-category-item-container'} key={i} onClick={()=>categorySelectionHandler(item)}>
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
    hasSubCategories:boolean;
    setSelectedSubCategory:React.Dispatch<React.SetStateAction<string>>;
    setHasSubCategories: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({setHasSubCategories, setSelectedSubCategory, selectedCategory, hasSubCategories}) =>{
    const axiosPrivate = useAxiosPrivate();
    const fetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        return res.data.data
    };
    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        if(!hasSubCategories) return null;
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<SUB_CATEGORY_PAGE_SIZE)) return null;
        return `${api_routes.sub_categories}?total=${SUB_CATEGORY_PAGE_SIZE}&page=${pageIndex+1}&sort=id${selectedCategory!=='All' ? '&filter[has_categories]='+selectedCategory : ''}`;
    }, [selectedCategory])

    
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

    const subCategorySelectionHandler = (subCategory: SubCategoryType) => {
        setSelectedSubCategory(subCategory.id.toString());
        setHasSubCategories(false);
    }

    return <div className='page-padding mt-1 subcategory-content-wrapper'>
        {
            (isLoading && data===undefined) &&  <LoadingCard itemCount={8} column={6} height='160px' />
        }
        <div className='subcategory-content-wrapper-container' id="subCategoryScrollableDiv">
            <InfiniteScroll
                dataLength={(!isLoading && data && data.length>0) ? data.flat().length : 0}
                next={() => {
                    console.log('called')
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