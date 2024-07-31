import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonSearchbar, IonToolbar, SearchbarInputEventDetail } from '@ionic/react';
import './Search.css';
import SearchCard from '../../components/SearchCard';
import { useCallback, useState } from 'react';
import { api_routes } from '../../helper/routes';
import { GlobalSearchType } from '../../helper/types';
import LoadingCard from '../../components/LoadingCard';
import useSWRInfinite from "swr/infinite";
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import NoData from '../../components/NoData';
import ViewCartBtn from '../../components/ViewCartBtn';
import InfiniteScroll from 'react-infinite-scroll-component';

const PAGE_SIZE = 20;

const Search: React.FC = () => {
    const axiosPrivate = useAxiosPrivate();
    const fetcher = async (url: string) => {
        const res =await axiosPrivate.get(url);
        return res.data.data
    };
    const [search, setSearch] = useState<string>("");

    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        if (search.length===0) return null;
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) return null;
        return `${api_routes.global_search}?total=${PAGE_SIZE}&page=${pageIndex+1}&sort=id&filter[search]=${search}`;
    }, [search])

    const {
        data:searchData,
        size,
        setSize,
        isLoading: isSearchLoading
    } = useSWRInfinite<GlobalSearchType>(getKey, fetcher,{
        initialSize:1,
        revalidateAll: false,
        revalidateFirstPage: false,
        persistSize: false,
        parallel: false
    });

    const searchFieldHandler = (ev:CustomEvent<SearchbarInputEventDetail>) => setSearch(ev.detail.value ? ev.detail.value : '');
    
    return (
        <IonPage>
            <IonHeader translucent={true}>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton color='dark'></IonBackButton>
                    </IonButtons>
                    <IonSearchbar showClearButton="focus" debounce={500} placeholder="Type to search..." className='search-input' onIonInput={(ev: CustomEvent<SearchbarInputEventDetail>) => searchFieldHandler(ev)} />
                </IonToolbar>
            </IonHeader>
            <IonContent
            fullscreen={false}
            forceOverscroll={false}
            style={{'--background': '#f2f2f2'}}
            >
                {
                    (isSearchLoading && search.length!==0) && <LoadingCard itemCount={6} column={12} />
                }
                {
                    (!isSearchLoading && searchData && searchData.flat().length===0 && search.length!==0) && <NoData message='No data is available!' />
                }
                <div className="page-padding scroll-freeze" id="searchScrollableDiv">
                    <InfiniteScroll
                        dataLength={(!isSearchLoading && searchData && searchData.length>0) ? searchData.flat().length : 0}
                        next={() => {
                            !isSearchLoading ? setSize(size+1) : null
                        }}
                        hasMore={true}
                        loader={isSearchLoading ? <LoadingCard itemCount={6} column={12} /> : null}
                        scrollableTarget="searchScrollableDiv"
                        style={{height:'100%'}}
                    >
                        {
                            (searchData ? searchData.flat(): []).map((item, index) => <SearchCard link={item.search_type=='PRODUCT' ? `/product-detail/${item.slug}` : (item.search_type=='CATEGORY' ? `/product?category_slug=${item.slug}` : `/product?sub_category_slug=${item.slug}`)} image={item.image} text={item.name} type={item.search_type} key={index} />)
                        }
                    </InfiniteScroll>
                </div>
                <ViewCartBtn />
            </IonContent>
        </IonPage>
    );
};

export default Search;