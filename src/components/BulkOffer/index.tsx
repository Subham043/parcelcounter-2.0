import { IonCard, IonCardHeader, IonIcon, IonText } from '@ionic/react';
import './BulkOffer.css';
import { checkmarkDoneOutline, informationCircleOutline } from 'ionicons/icons';
import { CartType, ProductPriceType } from '../../helper/types';
import ProductPrice from '../ProductPrice';

const BulkOffer: React.FC<{
    product_prices: ProductPriceType[], 
    cart_quantity_specification: string,
    cart_product_item: () => CartType[]
}> = ({product_prices, cart_quantity_specification, cart_product_item}) => {
    return (product_prices && product_prices.length > 0) && <div className='product-detail-page-main-bulk-factor page-padding mb-2 mt-2'>
        <IonCardHeader className='product-detail-card-header'>
            <div className='bulk-offer-wrapper'>
                <div className="cart-total-price-heading">
                    <h6>Prices are inclusive of GST.</h6>
                </div>
                <ul>
                    {
                        product_prices.map((item, i) => <li key={i}>
                            {
                                (cart_product_item().length>0 && item.min_quantity===cart_product_item()[0].product_price.min_quantity) ?
                                <div className="bulk-offer-text bulk-offer-text-active">
                                    <IonIcon icon={checkmarkDoneOutline} /> 
                                    <span>Buy {item.min_quantity} {cart_quantity_specification} or more at &#8377;{item.discount_in_price} / {cart_quantity_specification}</span>
                                </div>:
                                <div className="bulk-offer-text">
                                    <IonIcon icon={informationCircleOutline} /> 
                                    <span>Buy {item.min_quantity} {cart_quantity_specification} or more at &#8377;{item.discount_in_price} / {cart_quantity_specification}</span>
                                </div>
                            }
                        </li>)
                    }
                </ul>
            </div>
        </IonCardHeader>
    </div>
}

export default BulkOffer;