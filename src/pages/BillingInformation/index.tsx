import { IonButton, IonCol, IonContent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonItemDivider, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSpinner, RefresherEventDetail } from '@ionic/react';
import './BillingInformation.css';
import MainHeader from '../../components/MainHeader';
import { createOutline, peopleCircleOutline, trashOutline } from 'ionicons/icons';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback, useEffect, useRef, useState } from 'react';
import { api_routes } from '../../helper/routes';
import { BillingInformationType } from '../../helper/types';
import useSWRInfinite from "swr/infinite";
import { useAuth } from '../../context/AuthProvider';
import LoadingCard from '../../components/LoadingCard';
import { useToast } from '../../hooks/useToast';
import { useLocation } from 'react-router';
import BillingInformationEdit from '../../components/BillingInformationEdit';
import NoData from '../../components/NoData';

const PAGE_SIZE = 20;

const BillingInformation: React.FC = () => {

    const axiosPrivate = useAxiosPrivate();
    const {auth} = useAuth();
    const location = useLocation();
    const { toastSuccess, toastError} = useToast();
    const [modalData, setModalData] = useState<any>({
        isEdit:false
    });
    const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const productRef = useRef<HTMLIonInfiniteScrollElement | null>(null);
    
    const fetcher = useCallback(
        async (url: string) => {
          if(auth.authenticated){
            const headers = {
              headers: {
                "Authorization" : `Bearer ${auth.token}`,
                "Accept": 'application/json'
              }
            }
            const res =  await axiosPrivate.get(url,headers);
            setTimeout(async() => {
                if(productRef && productRef.current){
                  await productRef.current.complete()
                }
            }, 500)
            return res.data.data;
          }
          return undefined;
        },
        [auth],
    );
    
    const getKey = useCallback((pageIndex:any, previousPageData:any) => {
        if(!auth.authenticated) return null;
        setTimeout(async() => {
            if(productRef && productRef.current){
              await productRef.current.complete()
            }
        }, 500)
        if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) return null;
        return `${api_routes.billing_information_list}?total=${PAGE_SIZE}&page=${pageIndex+1}`;
    }, [auth.authenticated])
    
    const {
        data,
        size,
        setSize,
        mutate,
        isLoading
    } = useSWRInfinite<BillingInformationType>(getKey, fetcher,{
        initialSize:1,
        revalidateAll: true,
        revalidateFirstPage: false,
        persistSize: false,
        parallel: false
    });

    const deleteHandler = async (id: number) => {
        setDeleteLoading(true)
        try {
            const response = await axiosPrivate.delete(api_routes.billing_information_delete+`/${id}`);
            mutate();
            toastSuccess(response.data.message);
        } catch (error) {
            console.log(error);
            toastError('Oops. something went wrong! please try again later.');
        }finally {
            setDeleteLoading(false)
        }
    }

    useEffect(()=>{
        let isMounted = true;
        if(isMounted && auth.authenticated && location.pathname==='/billing-information'){
            mutate();
        }
        return () => {
            isMounted=false
        }
    }, [auth.authenticated, location.pathname])
    
    return (
        <IonPage>
            <MainHeader isMainHeader={false} name='Billing Information' />
            <IonContent fullscreen={false} forceOverscroll={false}>
                <IonRefresher slot="fixed" onIonRefresh={(event: CustomEvent<RefresherEventDetail>)=>{
                    setTimeout(() => {
                        // Any calls to load data go here
                        auth.authenticated && mutate();
                        event.detail.complete();
                    }, 1500);
                }}>
                    <IonRefresherContent></IonRefresherContent>
                </IonRefresher>
                <div className="mt-1">
                    <IonList>
                        {
                            (data ? data.flat(): []).map((item, i) => 
                                <IonItemSliding key={item.id}>
                                    <IonItem>
                                        <IonIcon aria-hidden="true" icon={peopleCircleOutline} slot="start" className='billing-address-location-icon'></IonIcon>
                                        <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                                            <IonCol
                                                size="12"
                                                className='text-left'
                                            >
                                                <IonLabel className='billing-address-text'>
                                                    <h6>{item.name}</h6>
                                                    <p>
                                                        {item.email}, {item.phone}{item.gst && item.gst.length>0 ? `, ${item.gst}`:''}
                                                    </p>
                                                </IonLabel>
                                            </IonCol>
                                        </IonRow>
                                    </IonItem>
                                    <IonItemOptions>
                                        <IonItemOption color='dark' onClick={()=>{
                                            setModalData({
                                                isEdit:true,
                                                data: {...item}
                                            })
                                            setIsOpen(true);
                                        }}>
                                            <IonIcon slot="icon-only" icon={createOutline} />
                                        </IonItemOption>
                                        <IonItemOption color="danger" disabled={deleteLoading} onClick={()=>deleteHandler(item.id)}>
                                            {deleteLoading ? <IonSpinner color='light' />: <IonIcon slot="icon-only" icon={trashOutline} />}
                                        </IonItemOption>
                                    </IonItemOptions>
                                </IonItemSliding>
                            )
                        }
                    </IonList>
                    {
                        isLoading && <LoadingCard itemCount={6} column={12} height='70px' />
                    }
                    {
                        (!isLoading && data && data.flat().length===0) && <NoData message='No billing information is available. Please add one!' />
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
                    <div className="cart-fixed-spacing-2"></div>
                </div>
                <IonModal isOpen={isOpen} onDidDismiss={()=>setIsOpen(false)} id={`billing-address-edit`} className="post-price-modal w-100" initialBreakpoint={1} breakpoints={[0, 1]}>
                    <BillingInformationEdit showModal={setIsOpen} mutate={mutate} {...modalData} />
                </IonModal>
                <IonItemDivider className="ion-padding address-divider w-100" slot="fixed">
                    <IonRow className="w-100 ion-align-items-center ion-justify-content-between">
                        <IonCol
                            size="12"
                            sizeLg='12'
                            sizeMd='12'
                            sizeSm='12'
                            sizeXl='12'
                            sizeXs='12'
                            className='text-center'
                        >
                            <IonButton className="add-address-btn w-100" fill='solid' color="dark" onClick={()=>{
                                setModalData({
                                    isEdit:false
                                })
                                setIsOpen(true);
                            }}>
                                Add New Information
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonItemDivider>
            </IonContent>
        </IonPage>
        
    );
}

export default BillingInformation;