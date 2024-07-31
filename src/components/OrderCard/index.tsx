import { IonBadge, IonCol, IonLabel, IonRow, IonText } from '@ionic/react';
import './OrderCard.css'
import { OrderType } from '../../helper/types';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';

const OrderCard: React.FC<OrderType> = ({id, total_price, products, statuses, created_at}) =>{
    const productNames = useMemo(() => products.map(item => item.name).join(', '), [id]);

    return <Link className='no-underline' to={`/order/${id}`}>
        <div className='order-card'>
            <IonRow className="ion-justify-content-between w-100">
                <IonCol
                    size="9"
                    className='text-left'
                >
                    <IonLabel class='order-card-product-label'>
                        <h3 className='order-card-product-names'>{productNames}</h3>
                    </IonLabel>
                </IonCol>
                <IonCol
                    size="3"
                    className='text-right'
                >
                    <IonText>
                        <b className='order-card-product-price'>&#8377;{total_price}</b>
                    </IonText>
                </IonCol>
            </IonRow>
            <IonRow className="ion-align-items-end ion-justify-content-between w-100">
                <IonCol
                    size="8"
                    className='text-left'
                >
                    <IonText>
                        <p className='order-card-product-order-id'>
                            Order#{id}
                        </p>
                        <p className='order-card-product-timestamp'>
                            Placed: {created_at}
                        </p>
                    </IonText>
                </IonCol>
                <IonCol
                    size="4"
                    className='text-right'
                >
                    <IonBadge color="dark">{statuses.length>0 ? statuses[statuses.length-1].status : 'PROCESSING'}</IonBadge>
                </IonCol>
            </IonRow>
        </div>
    </Link>
}

export default OrderCard;