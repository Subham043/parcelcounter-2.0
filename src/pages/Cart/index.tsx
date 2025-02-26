import { IonButton, IonCard, IonCheckbox, IonCol, IonContent, IonIcon, IonItemDivider, IonLabel, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonSpinner, IonText, RefresherEventDetail } from '@ionic/react';
import './Cart.css';
import MainHeader from '../../components/MainHeader';
import CommonHeading from '../../components/CommonHeading';
import EmptyCart from '../../components/EmptyCart';
import { useCartContext } from '../../context/CartProvider';
import { useEffect, useState } from 'react';
import CartItem from '../../components/CartItem';
import useSWR, { useSWRConfig } from 'swr';
import { api_routes } from '../../helper/routes';
import { useAuth } from '../../context/AuthProvider';
import { useHistory, useLocation } from 'react-router';
import LoadingCard from '../../components/LoadingCard';
import { cardOutline, cashOutline, locationOutline, peopleCircleOutline } from 'ionicons/icons';
import { BillingAddressResponseType, BillingInformationResponseType } from '../../helper/types';
import { useToast } from '../../hooks/useToast';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { Browser } from '@capacitor/browser';

const Cart: React.FC = () => {
    const axiosPrivate = useAxiosPrivate();
    const { toastSuccess, toastError} = useToast();
    const history = useHistory();
    const { cart, cartLoading } = useCartContext();
    const { auth } = useAuth();
    const location = useLocation();
    const { mutate } = useSWRConfig();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [acceptTerms, setAcceptTerms] = useState<boolean>(true);
    const [includeGst, setIncludeGst] = useState<boolean>(false);
    const [modeOfPayment, setModeOfPayment] = useState<string>('Cash On Delivery');
    const [selectedBillingInformationData, setSelectedBillingInformationData] = useState<number>(0)
    const [selectedBillingAddressData, setSelectedBillingAddressData] = useState<number>(0)
    const { data:billingInformationData, isLoading:billingInformationLoading } = useSWR<BillingInformationResponseType>(auth.authenticated ? api_routes.billing_information_all : null);
    const { data:billingAddressData, isLoading:billingAddressLoading } = useSWR<BillingAddressResponseType>(auth.authenticated ? api_routes.billing_address_all : null);
    useEffect(()=>{
        let isMounted = true;
        if(isMounted && auth.authenticated && location.pathname==='/cart'){
            mutate(api_routes.cart_all);
            mutate(api_routes.billing_information_all);
            mutate(api_routes.billing_address_all);
        }
        return () => {
            isMounted=false
        }
    }, [auth.authenticated, location.pathname])

    useEffect(() => {
        if(auth.authenticated && billingInformationData!==undefined && billingInformationData.data.length>0 ){
            setSelectedBillingInformationData(billingInformationData && billingInformationData.data.length>0 ? billingInformationData.data[0].id : 0)
        }
        return () => {setSelectedBillingInformationData(0)}
    }, [auth.authenticated, billingInformationData])
    
    useEffect(() => {
        if(auth.authenticated && billingAddressData!==undefined && billingAddressData.data.length>0 ){
            setSelectedBillingAddressData(billingAddressData && billingAddressData.data.length>0 ? billingAddressData.data[0].id : 0)
        }
        return () => {setSelectedBillingAddressData(0)}
    }, [auth.authenticated, billingAddressData])

    const placeOrderHandler = async (data: any) => {
        if(selectedBillingAddressData===0){
          toastError('please select / add an address');
          return;
        }
        if(selectedBillingInformationData===0){
          toastError('please select / add an billing information');
          return;
        }
        if(!acceptTerms){
          toastError('please accept the terms & condition');
          return;
        }
        
        setLoading(true);
        try {
          const response = await axiosPrivate.post(api_routes.place_order, {
            billing_address_id: selectedBillingAddressData, 
            billing_information_id: selectedBillingInformationData, 
            order_mode: 'APP', 
            mode_of_payment: modeOfPayment, 
            accept_terms: acceptTerms ? 1 : 0, 
            include_gst: includeGst ? 1 : 0
          });
          if(modeOfPayment==='Cash On Delivery'){
            toastSuccess(response.data.message);
            setIsOpen(false)
            mutate(api_routes.cart_all)
            history.push(`/order/${response.data?.order?.id}`);
          }else{
            makePayment(response.data?.order?.payment?.phone_pe_payment_link, response.data?.order?.id)
          }
        } catch (error: any) {
          if (error?.response?.data?.message) {
            toastError(error?.response?.data?.message);
          }
        } finally {
          setLoading(false);
        }
    };

    const makePayment = async(url:string, order_id:string) =>{
        await Browser.open({ url });
        Browser.addListener('browserFinished', async ()=>{
          try {
            setLoading(true);
            const response = await axiosPrivate.get(api_routes.place_order_detail+`/${order_id}`);
            if(response.data.order.payment.status!=='PENDING'){
                toastSuccess('Order placed successfully.');
                setIsOpen(false)
                mutate(api_routes.cart_all)
                history.push(`/order/${response.data?.order?.id}`);
            }
          } catch (error) {
              console.log(error);
          }finally{
              setLoading(false);
          }
        });
    }

    return (
        <IonPage>
            <MainHeader isMainHeader={true} />
            <IonContent
            fullscreen={false}
            forceOverscroll={false}
            >
                <CommonHeading text='Cart' />
                {
                    cartLoading ? <LoadingCard itemCount={4} column={12} height='100px' /> :
                    <>
                        <IonRefresher slot="fixed" onIonRefresh={(event: CustomEvent<RefresherEventDetail>)=>{
                            setTimeout(() => {
                                // Any calls to load data go here
                                mutate(api_routes.cart_all);
                                event.detail.complete();
                            }, 1500);
                        }}>
                            <IonRefresherContent></IonRefresherContent>
                        </IonRefresher>
                        {
                            cart.cart.length===0 ? 
                            <EmptyCart /> :
                            <>
                                <IonCard className="cart-card">
                                    {
                                        cart.cart.map((item, i) => <CartItem {...item} key={i} />)
                                    }
                                </IonCard>
                                <div className='cart-message'>
                                    <p>You have realized a minimum savings of 20% - 25% on your standard purchase when compared to retail price.</p>
                                </div>
                                <IonCard>
                                    <div className='cart-total-price-heading'>
                                        <h6>Note: Prices are inclusive of GST.</h6>
                                    </div>
                                    <div>
                                        <IonItemDivider className="cart-divider">
                                            <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                                                <IonCol
                                                    size="6"
                                                    className='text-left'
                                                >
                                                    <IonText>
                                                    <p className='cart-text'>Sub Total</p>
                                                    </IonText>
                                                </IonCol>
                                                <IonCol
                                                    size="6"
                                                    className='text-right'
                                                >
                                                    <IonText>
                                                    <p className='cart-text'><b><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{cart.cart_subtotal.toFixed(2)}</b></p>
                                                    </IonText>
                                                </IonCol>
                                            </IonRow>
                                        </IonItemDivider>
                                        <IonItemDivider className="cart-divider">
                                            <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                                                <IonCol
                                                    size="6"
                                                    className='text-left'
                                                >
                                                    <IonText>
                                                    <p className='cart-text'>Delivery Charges</p>
                                                    </IonText>
                                                </IonCol>
                                                <IonCol
                                                    size="6"
                                                    className='text-right'
                                                >
                                                    <IonText>
                                                    <p className='cart-text'><b>Free</b></p>
                                                    </IonText>
                                                </IonCol>
                                            </IonRow>
                                        </IonItemDivider>
                                        <IonItemDivider className="cart-divider">
                                            <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                                                <IonCol
                                                    size="6"
                                                    className='text-left'
                                                >
                                                    <IonText>
                                                    <p className='cart-text'><code>Total</code></p>
                                                    </IonText>
                                                </IonCol>
                                                <IonCol
                                                    size="6"
                                                    className='text-right'
                                                >
                                                    <IonText>
                                                    <p className='cart-text'><b><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{cart.total_price.toFixed(2)}</b></p>
                                                    </IonText>
                                                </IonCol>
                                            </IonRow>
                                        </IonItemDivider>
                                    </div>
                                </IonCard>
                            </>
                        }
                        <div className="cart-fixed-spacing-2"></div>
                        {
                            cart.cart.length>0 &&
                            <>
                                <IonModal isOpen={isOpen} onDidDismiss={()=>setIsOpen(false)} id={`checkout-main-modal`} className="post-price-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
                                    <div className='mt-2 mb-2'>
                                        <div className='ion-padding billing-info-section'>
                                            <IonText>
                                                <h5 className='billing-info-cart-heading'>Billing Information</h5>
                                                <p className='billing-info-cart-text'><code>Pick a billing information</code></p>
                                            </IonText>
                                            {
                                                billingInformationLoading ? <div className='text-left mt-1 mb-1'>
                                                    <IonSpinner color='dark' />
                                                </div>:
                                                <div className='billing-info-section-row'>
                                                    {
                                                        billingInformationData?.data.map((item, i) => <div className={selectedBillingInformationData===item.id ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>setSelectedBillingInformationData(item.id)} key={i}>
                                                            <IonIcon aria-hidden="true" icon={peopleCircleOutline} className='billing-info-section-card-icon'></IonIcon>
                                                            <IonLabel className='billing-info-section-card-text'>
                                                                <h6>{item.name}</h6>
                                                                <p>{item.email}</p>
                                                                <p>{item.phone}</p>
                                                                <p>{item.gst}</p>
                                                            </IonLabel>
                                                        </div>)
                                                    }
                                                </div>
                                            }
                                        </div>
                                        <div className='ion-padding billing-info-section'>
                                            <IonText>
                                                <h5 className='billing-info-cart-heading'>Delivery Address</h5>
                                                <p className='billing-info-cart-text'><code>Pick a delivery address</code></p>
                                            </IonText>
                                            {
                                                billingAddressLoading ? <div className='text-left mt-1 mb-1'>
                                                    <IonSpinner color='dark' />
                                                </div>
                                                :
                                                <div className='billing-info-section-row'>
                                                    {
                                                        billingAddressData?.data.map((item, i) => <div className={selectedBillingAddressData===item.id ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>setSelectedBillingAddressData(item.id)} key={i}>
                                                            <IonIcon aria-hidden="true" icon={locationOutline} className='billing-info-section-card-icon'></IonIcon>
                                                            <IonLabel className='billing-info-section-card-text'>
                                                                <h6>{item.country}</h6>
                                                                <p>
                                                                    {item.address}, {item.city}, {item.state} - {item.pin}, {item.country}
                                                                </p>
                                                            </IonLabel>
                                                        </div>)
                                                    }
                                                </div>
                                            }
                                        </div>
                                        <div className='ion-padding billing-info-section'>
                                            <IonText>
                                                <h5 className='billing-info-cart-heading'>Payment Option</h5>
                                                <p className='billing-info-cart-text'><code>Pick a payment option</code></p>
                                            </IonText>
                                            <div className='billing-info-section-row'>
                                                <div className={modeOfPayment==='Cash On Delivery' ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>setModeOfPayment('Cash On Delivery')}>
                                                    <IonIcon aria-hidden="true" icon={cashOutline} className='billing-info-section-card-icon'></IonIcon>
                                                    <IonLabel className='billing-info-section-card-text'>
                                                        <h6>Cash On Delivery</h6>
                                                    </IonLabel>
                                                </div>
                                                <div className={modeOfPayment==='Online - Phonepe' ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>setModeOfPayment('Online - Phonepe')}>
                                                    <IonIcon aria-hidden="true" icon={cardOutline} className='billing-info-section-card-icon'></IonIcon>
                                                    <IonLabel className='billing-info-section-card-text'>
                                                        <h6>Pay Online - Phonepe</h6>
                                                    </IonLabel>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='ion-padding billing-info-section'>
                                            <div>
                                                <IonCheckbox labelPlacement="end" color='dark' checked={includeGst} onIonChange={()=>setIncludeGst(prev => !prev)}>Use GST Invoice.</IonCheckbox>
                                            </div>
                                            <div>
                                                <IonCheckbox className='mt-1' color='dark' labelPlacement="end" checked={acceptTerms} onIonChange={()=>setAcceptTerms(prev => !prev)}>I agree to your Terms and Conditions.</IonCheckbox>
                                            </div>
                                        </div>
                                        <div className='text-center'>
                                            <IonButton className="cart-btn" fill='solid' color="dark" disabled={loading} onClick={placeOrderHandler}>
                                                {
                                                    loading ? <IonSpinner name='dots' color='light' /> : 
                                                    'Place Order'
                                                }
                                            </IonButton>
                                        </div>
                                    </div>
                                </IonModal>
                                <IonItemDivider className="ion-padding cart-divider-total w-100" slot="fixed">
                                    <IonRow className="w-100 ion-align-items-center ion-justify-content-between">
                                        <IonCol
                                            size="6"
                                            sizeLg='6'
                                            sizeMd='6'
                                            sizeSm='6'
                                            sizeXl='6'
                                            sizeXs='6'
                                            className='text-left'
                                        >
                                            <IonText color="dark">
                                                <p className="product-detail-price m-0"><b>Total : <strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{cart.total_price.toFixed(2)}</b></p>
                                            </IonText>
                                        </IonCol>
                                        <IonCol
                                            size="6"
                                            sizeLg='6'
                                            sizeMd='6'
                                            sizeSm='6'
                                            sizeXl='6'
                                            sizeXs='6'
                                            className='text-right'
                                        >
                                            <IonButton className="cart-btn" fill='solid' color="dark" disabled={loading} onClick={()=>setIsOpen(true)}>
                                                {
                                                    loading ? <IonSpinner name='dots' color='light' /> : 
                                                    'Checkout'
                                                }
                                            </IonButton>
                                        </IonCol>
                                    </IonRow>
                                </IonItemDivider>
                            </>
                        }
                    </>
                }
            </IonContent>
        </IonPage>
    );
};

export default Cart;
