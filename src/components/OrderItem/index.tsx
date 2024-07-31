import { IonCol, IonImg, IonItemDivider, IonRow, IonSpinner, IonText } from "@ionic/react";
import { useState } from "react";
import { OrderProductType } from "../../helper/types";

const OrderItem: React.FC<OrderProductType> = (props) => 
{
    const [imgLoading, setImgLoading] = useState<boolean>(true);
    const [imgError, setImgLoadingError] = useState<boolean>(false);
    return <IonItemDivider className="cart-divider">
        <IonRow className="ion-align-items-center ion-justify-content-between w-100">
            <IonCol
                size="7"
                className='text-left'
            >
                <div className='order-item-detail-wrapper'>
                    <div className="p-relative">
                        {
                            imgLoading &&
                            <div className="text-center img-loader">
                                <IonSpinner color='dark' />
                            </div>
                        }
                        <IonImg alt="product" className='cart-card-item-img order-item-img' src={imgError ? '/images/category-all.webp' : props.image} onIonError={()=>{setImgLoading(false); setImgLoadingError(true)}} onIonImgDidLoad={()=>setImgLoading(false)} />
                    </div>
                    <IonText color="dark" class='order-item-text'>
                        <p className="cart-card-item-text order-item-name">{props.name}</p>
                        <p className="cart-card-item-price"><b>&#8377;{props.discount_in_price}</b> / {props.unit}</p>
                    </IonText>
                </div>
            </IonCol>
            <IonCol
                size="3"
                className='text-center'
            >
                <p className='order-detail-price-text'>{props.quantity}<br/>{props.unit}</p>
            </IonCol>
            <IonCol
                size="2"
                className='text-right'
            >
                <p className='order-detail-price-text'>&#8377;{props.amount}</p>
            </IonCol>
        </IonRow>
    </IonItemDivider>
}

export default OrderItem