import { IonButton, IonCol, IonIcon, IonItemDivider, IonRow } from "@ionic/react";
import React from "react";
import { useCartContext } from "../../context/CartProvider";
import './ViewCartBtn.css';
import { Link } from "react-router-dom";
import { cartOutline } from "ionicons/icons";

const ViewCartBtn: React.FC = () => {
    const { cart } = useCartContext();
    return cart.cart.length>0 ? <>
        <IonItemDivider className="view-cart-checkout-btn-main-container" slot="fixed">
            <Link className="w-100 no-underline" to='/cart'>
                <IonRow className="ion-align-items-center ion-justify-content-center p-0 w-100">
                    <IonCol
                        size="12"
                        className='text-right'
                    >
                        <IonButton className="pagination-btn m-0" fill='solid' color="dark">
                            <IonRow className="ion-align-items-center ion-justify-content-center p-0 w-100">
                                <IonCol
                                    size="6"
                                    className='text-left p-0'
                                >
                                    <div>
                                        {cart.cart.length} {cart.cart.length===1 ? 'Item' : 'Items'} | &#8377;{cart.total_price}
                                    </div>
                                </IonCol>
                                <IonCol
                                    size="6"
                                    className='text-right p-0'
                                >
                                    <div className="view-cart-text-icon-holder">
                                        <span>View Cart</span>
                                        <IonIcon icon={cartOutline} className="svg-icon" />
                                    </div>
                                </IonCol>
                            </IonRow>
                                
                        </IonButton>
                    </IonCol>
                </IonRow>
            </Link>
        </IonItemDivider>
        <div className="fixed-spacing-2"></div>
    </> : <></>
}

export default ViewCartBtn;