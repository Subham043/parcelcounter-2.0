import { IonBadge, IonButton, IonButtons, IonCard, IonCol, IonContent, IonHeader, IonIcon, IonItem, IonItemDivider, IonLabel, IonModal, IonPage, IonRefresher, IonRefresherContent, IonRow, IonText, IonTitle, IonToolbar, RefresherEventDetail } from '@ionic/react';
import './OrderDetail.css';
import useSWR from 'swr'
import { OrderType } from '../../helper/types';
import { useAuth } from '../../context/AuthProvider';
import { api_routes } from '../../helper/routes';
import { RouteComponentProps, useHistory } from 'react-router';
import { arrowBack, callOutline, chatbubbleEllipsesOutline, checkmarkOutline, homeOutline, mailOutline, personOutline, searchOutline } from 'ionicons/icons';
import LoadingCard from '../../components/LoadingCard';
import OrderItem from '../../components/OrderItem';
import { useState } from 'react';
import OrderHelp from '../../components/OrderHelp';

interface OrderProps extends RouteComponentProps<{
    slug: string;
}> {}

const OrderDetail: React.FC<OrderProps> = ({match}) =>{

    const {auth} = useAuth();
    const history = useHistory();
    const [isOpen, setIsOpen] = useState(false);
    const { data:order, isLoading:loading, mutate } = useSWR<{order: OrderType}>(auth.authenticated ? api_routes.place_order_detail_success + `/${match.params.slug}` : null);

    return <IonPage>
        <IonHeader translucent={true} className='main-header'>
            <IonToolbar mode="ios" className='main-header-toolbar'>
                <IonButtons slot="start">
                    <IonButton color='dark' onClick={()=>history.goBack()}>
                        <IonIcon icon={arrowBack} />
                    </IonButton>
                </IonButtons>
                <IonTitle>{order ? `Order#${order?.order.id}` : ''}</IonTitle>
                {order && <IonButtons slot="end">
                    <IonButton className='main-header-button order-detail-help-button' color='dark' onClick={()=>setIsOpen(true)}><span>Help</span> <IonIcon icon={chatbubbleEllipsesOutline} /></IonButton>
                </IonButtons>}
            </IonToolbar>
        </IonHeader>
        <IonContent
        fullscreen={false}
        forceOverscroll={false}
        >
            <IonRefresher slot="fixed" onIonRefresh={(event: CustomEvent<RefresherEventDetail>)=>{
                setTimeout(() => {
                    // Any calls to load data go here
                    auth.authenticated && mutate();
                    event.detail.complete();
                }, 1500);
            }}>
                <IonRefresherContent></IonRefresherContent>
            </IonRefresher>
            {
                loading ? <LoadingCard itemCount={4} column={12} height='170px' /> :
                order &&
                <>
                    <div className='order-detail-padding mt-1'>
                        <IonRow className="ion-align-items-end ion-justify-content-between w-100">
                            <IonCol
                                size="8"
                                className='text-left'
                            >
                                <IonText>
                                    <p className='order-card-product-order-id order-detail-id'>
                                        Order#{order.order.id}
                                    </p>
                                    <p className='order-card-product-timestamp'>
                                        Placed: {order.order.created_at}
                                    </p>
                                </IonText>
                            </IonCol>
                            <IonCol
                                size="4"
                                className='text-right'
                            >
                                <IonBadge color="dark">{order.order.statuses.length>0 ? order.order.statuses[order.order.statuses.length-1].status : 'ORDER PLACED'}</IonBadge>
                            </IonCol>
                        </IonRow>
                    </div>
                    <IonCard className="cart-card">
                        {
                            order.order.products.map((item, i) => <OrderItem {...item} key={i} />)
                        }
                    </IonCard>
                    <div className='mt-1'>
                        <IonCard>
                            <div className="product-detail-page-main-bulk-factor">
                                <div className="cart-total-price-heading cart-total-price-heading-2">
                                    <h6>Order Timeline</h6>
                                </div>
                            </div>
                            <div className='order-detail-timeline-container'>
                                <div className='order-detail-timeline'>
                                    {(order.order.statuses.filter(s=>s.status==='CANCELLED').length===0 || order.order.statuses.filter(s=>s.status==='ORDER PLACED').length>0) && <div className={`order-detail-timeline-item ${order.order.statuses.length>0 && order.order.statuses.map(s=>s.status).includes('ORDER PLACED') ? 'timeline-active' : ''}`}>
                                        <div className='order-detail-timeline-icon'>
                                            <IonIcon icon={checkmarkOutline} />
                                        </div>
                                        <div className='order-detail-timeline-info'>
                                            <h5 className='order-detail-timeline-heading'>Order Placed</h5>
                                            <p className='order-detail-timeline-time'>{order.order.statuses.length>0 && order.order.statuses.filter(s=>s.status==='ORDER PLACED').length>0 && order.order.statuses[order.order.statuses.findIndex(s=>s.status==='ORDER PLACED')].created_at}</p>
                                        </div>
                                    </div>}
                                    {(order.order.statuses.filter(s=>s.status==='CANCELLED').length===0 || order.order.statuses.filter(s=>s.status==='CONFIRMED').length>0) && <div className={`order-detail-timeline-item ${order.order.statuses.length>0 && order.order.statuses.map(s=>s.status).includes('CONFIRMED') ? 'timeline-active' : ''}`}>
                                        <div className='order-detail-timeline-icon'>
                                            <IonIcon icon={checkmarkOutline} />
                                        </div>
                                        <div className='order-detail-timeline-info'>
                                            <h5 className='order-detail-timeline-heading'>Confirmed</h5>
                                            <p className='order-detail-timeline-time'>{order.order.statuses.length>0 && order.order.statuses.filter(s=>s.status==='CONFIRMED').length>0 && order.order.statuses[order.order.statuses.findIndex(s=>s.status==='CONFIRMED')].created_at}</p>
                                        </div>
                                    </div>}
                                    {(order.order.statuses.filter(s=>s.status==='CANCELLED').length===0 || order.order.statuses.filter(s=>s.status==='PACKED').length>0) && <div className={`order-detail-timeline-item ${order.order.statuses.length>0 && order.order.statuses.map(s=>s.status).includes('PACKED') ? 'timeline-active' : ''}`}>
                                        <div className='order-detail-timeline-icon'>
                                            <IonIcon icon={checkmarkOutline} />
                                        </div>
                                        <div className='order-detail-timeline-info'>
                                            <h5 className='order-detail-timeline-heading'>Order Packed</h5>
                                            <p className='order-detail-timeline-time'>{order.order.statuses.length>0 && order.order.statuses.filter(s=>s.status==='PACKED').length>0 && order.order.statuses[order.order.statuses.findIndex(s=>s.status==='PACKED')].created_at}</p>
                                        </div>
                                    </div>}
                                    {(order.order.statuses.filter(s=>s.status==='CANCELLED').length===0 || order.order.statuses.filter(s=>s.status==='READY FOR SHIPMENT').length>0) && <div className={`order-detail-timeline-item ${order.order.statuses.length>0 && order.order.statuses.map(s=>s.status).includes('READY FOR SHIPMENT') ? 'timeline-active' : ''}`}>
                                        <div className='order-detail-timeline-icon'>
                                            <IonIcon icon={checkmarkOutline} />
                                        </div>
                                        <div className='order-detail-timeline-info'>
                                            <h5 className='order-detail-timeline-heading'>Ready For Shipment</h5>
                                            <p className='order-detail-timeline-time'>{order.order.statuses.length>0 && order.order.statuses.filter(s=>s.status==='READY FOR SHIPMENT').length>0 && order.order.statuses[order.order.statuses.findIndex(s=>s.status==='READY FOR SHIPMENT')].created_at}</p>
                                        </div>
                                    </div>}
                                    {(order.order.statuses.filter(s=>s.status==='CANCELLED').length===0 || order.order.statuses.filter(s=>s.status==='OUT FOR DELIVERY').length>0) && <div className={`order-detail-timeline-item ${order.order.statuses.length>0 && order.order.statuses.map(s=>s.status).includes('OUT FOR DELIVERY') ? 'timeline-active' : ''}`}>
                                        <div className='order-detail-timeline-icon'>
                                            <IonIcon icon={checkmarkOutline} />
                                        </div>
                                        <div className='order-detail-timeline-info'>
                                            <h5 className='order-detail-timeline-heading'>Out For Delivery</h5>
                                            <p className='order-detail-timeline-time'>{order.order.statuses.length>0 && order.order.statuses.filter(s=>s.status==='OUT FOR DELIVERY').length>0 && order.order.statuses[order.order.statuses.findIndex(s=>s.status==='OUT FOR DELIVERY')].created_at}</p>
                                        </div>
                                    </div>}
                                    {(order.order.statuses.filter(s=>s.status==='CANCELLED').length===0 || order.order.statuses.filter(s=>s.status==='DELIVERED').length>0) && <div className={`order-detail-timeline-item ${order.order.statuses.length>0 && order.order.statuses.map(s=>s.status).includes('DELIVERED') ? 'timeline-active' : ''}`}>
                                        <div className='order-detail-timeline-icon'>
                                            <IonIcon icon={checkmarkOutline} />
                                        </div>
                                        <div className='order-detail-timeline-info'>
                                            <h5 className='order-detail-timeline-heading'>Delivered</h5>
                                            <p className='order-detail-timeline-time'>{order.order.statuses.length>0 && order.order.statuses.filter(s=>s.status==='DELIVERED').length>0 && order.order.statuses[order.order.statuses.findIndex(s=>s.status==='DELIVERED')].created_at}</p>
                                        </div>
                                    </div>}
                                    {(order.order.statuses.filter(s=>s.status==='CANCELLED').length>0) && <div className={`order-detail-timeline-item ${order.order.statuses.length>0 && order.order.statuses.map(s=>s.status).includes('CANCELLED') ? 'timeline-active' : ''}`}>
                                        <div className='order-detail-timeline-icon'>
                                            <IonIcon icon={checkmarkOutline} />
                                        </div>
                                        <div className='order-detail-timeline-info'>
                                            <h5 className='order-detail-timeline-heading'>Cancelled</h5>
                                            <p className='order-detail-timeline-time'>{order.order.statuses.length>0 && order.order.statuses.filter(s=>s.status==='CANCELLED').length>0 && order.order.statuses[order.order.statuses.findIndex(s=>s.status==='CANCELLED')].created_at}</p>
                                        </div>
                                    </div>}
                                </div>
                            </div>
                        </IonCard>
                    </div>
                    <div className='cart-message mt-1'>
                        <p>You have realized a minimum savings of 20% - 25% on your standard purchase when compared to retail price.</p>
                    </div>
                    <IonCard className='mt-1'>
                        <div className="product-detail-page-main-bulk-factor">
                            <div className="cart-total-price-heading">
                                <h6>Prices are inclusive of GST.</h6>
                            </div>
                        </div>
                        <div>
                            <IonItemDivider className="cart-divider">
                                <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                                    <IonCol
                                        size="6"
                                        className='text-left'
                                    >
                                        <IonText>
                                        <p className='order-detail-price-text'>Sub Total</p>
                                        </IonText>
                                    </IonCol>
                                    <IonCol
                                        size="6"
                                        className='text-right'
                                    >
                                        <IonText>
                                        <p className='order-detail-price-text'><b><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{order.order.subtotal.toFixed(2)}</b></p>
                                        </IonText>
                                    </IonCol>
                                </IonRow>
                            </IonItemDivider>
                            {
                                order.order.charges.map((item, i)=> (<IonItemDivider className="cart-divider" key={i}>
                                    <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                                        <IonCol
                                            size="6"
                                            className='text-left'
                                        >
                                            <IonText>
                                            <p className='order-detail-price-text'>{item.charges_name}</p>
                                            </IonText>
                                        </IonCol>
                                        <IonCol
                                            size="6"
                                            className='text-right'
                                        >
                                            <IonText>
                                            <p className='order-detail-price-text'><b><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{item.total_charge_in_amount.toFixed(2)}</b></p>
                                            </IonText>
                                        </IonCol>
                                    </IonRow>
                                </IonItemDivider>))
                            }
                            <IonItemDivider className="cart-divider">
                                <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                                    <IonCol
                                        size="6"
                                        className='text-left'
                                    >
                                        <IonText>
                                        <p className='order-detail-price-text'><code>Total</code></p>
                                        </IonText>
                                    </IonCol>
                                    <IonCol
                                        size="6"
                                        className='text-right'
                                    >
                                        <IonText>
                                        <p className='order-detail-price-text'><b><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{order.order.total_price.toFixed(2)}</b></p>
                                        </IonText>
                                    </IonCol>
                                </IonRow>
                            </IonItemDivider>
                        </div>
                    </IonCard>
                    <IonCard>
                        <div className="product-detail-page-main-bulk-factor">
                            <div className="cart-total-price-heading cart-total-price-heading-2">
                                <h6>Payment Information</h6>
                            </div>
                        </div>
                        <div>
                            <IonItemDivider className="cart-divider">
                                <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                                    <IonCol
                                        size="6"
                                        className='text-left'
                                    >
                                        <IonText>
                                        <p className='order-detail-price-text'>Payment Mode</p>
                                        </IonText>
                                    </IonCol>
                                    <IonCol
                                        size="6"
                                        className='text-right'
                                    >
                                        <IonText>
                                        <p className='order-detail-price-text'><b>{order.order.payment.mode}</b></p>
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
                                        <p className='order-detail-price-text'>Payment Status</p>
                                        </IonText>
                                    </IonCol>
                                    <IonCol
                                        size="6"
                                        className='text-right'
                                    >
                                        <IonBadge color="dark">{order.order.payment.status}</IonBadge>
                                    </IonCol>
                                </IonRow>
                            </IonItemDivider>
                        </div>
                    </IonCard>
                    <IonCard className="mt-1">
                        <div className="product-detail-page-main-bulk-factor">
                            <div className="cart-total-price-heading cart-total-price-heading-2">
                                <h6>Billing Information</h6>
                            </div>
                        </div>
                        <div>
                            <IonItem lines="inset">
                                <IonIcon icon={personOutline} slot="start" className='order-detail-billing-icon'></IonIcon>
                                <IonLabel>
                                    <p className='order-detail-personal-info'>{order.order.name}</p>
                                </IonLabel>
                            </IonItem>
                            <IonItem lines="inset">
                                <IonIcon icon={mailOutline} slot="start" className='order-detail-billing-icon'></IonIcon>
                                <IonLabel>
                                    <p className='order-detail-personal-info'>{order.order.email}</p>
                                </IonLabel>
                            </IonItem>
                            <IonItem lines="inset">
                                <IonIcon icon={callOutline} slot="start" className='order-detail-billing-icon'></IonIcon>
                                <IonLabel>
                                    <p className='order-detail-personal-info'>{order.order.phone}</p>
                                </IonLabel>
                            </IonItem>
                            <IonItem lines="inset">
                                <IonIcon icon={homeOutline} slot="start" className='order-detail-billing-icon'></IonIcon>
                                <IonLabel className="ion-text-wrap">
                                    <p className='order-detail-personal-info'>{order.order.address}, {order.order.city}, {order.order.state} - {order.order.pin}, {order.order.country}</p>
                                </IonLabel>
                            </IonItem>
                        </div>
                    </IonCard>
                    <IonModal isOpen={isOpen} onDidDismiss={()=>setIsOpen(false)} id={`order-help-main-modal`} className="post-price-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
                        <OrderHelp id={order.order.id} showModal={setIsOpen} />
                    </IonModal>
                </>
            }
        </IonContent>
    </IonPage>
}

export default OrderDetail;