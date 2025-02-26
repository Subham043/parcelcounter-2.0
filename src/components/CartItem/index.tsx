import { IonCol, IonImg, IonItemDivider, IonRow, IonSpinner, IonText } from "@ionic/react";
import React, { useState } from "react";
import CartQuantity from "../CartQuantity";
import { CartType } from "../../helper/types";
import { useCart } from "../../hooks/useCart";
import './CartItem.css';

const CartItem: React.FC<CartType> = ({ product, product_price, amount }) => {
    const [imgLoading, setImgLoading] = useState<boolean>(true);
    const [imgError, setImgLoadingError] = useState<boolean>(false);
    const {quantity, cartItemLoading, incrementQuantity, changeQuantity, decrementQuantity} = useCart({id: product.id, product:product, product_prices: product.product_prices, min_cart_quantity: product.min_cart_quantity, cart_quantity_interval: product.cart_quantity_interval});

    return <IonItemDivider className="cart-divider">
        <IonRow className="ion-align-items-center ion-justify-content-between w-100">
            <IonCol
                size="5"
                className='text-left'
            >
            {
                imgLoading &&
                <div className="text-center mt-1">
                    <IonSpinner color='dark' />
                </div>
            }
            <IonImg alt="product" className='cart-card-item-img' src={imgError ? '/images/category-all.webp' : product.image} onIonError={()=>{setImgLoading(false); setImgLoadingError(true)}} onIonImgDidLoad={()=>setImgLoading(false)} />
            <IonText color="dark">
                <p className="cart-card-item-text">{product.name}</p>
                <p className="cart-card-item-price"><b><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{product_price.discount_in_price.toFixed(2)}</b> / {product.cart_quantity_specification}</p>
            </IonText>
            </IonCol>
            <IonCol
                size="5"
                className='text-left'
            >
                <CartQuantity quantity={quantity} min_cart_quantity={product.min_cart_quantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} changeQuantity={changeQuantity} loading={cartItemLoading} />
            </IonCol>
            <IonCol
                size="2"
                className='text-right'
            >
                <p className='cart-text'><b><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{amount.toFixed(2)}</b></p>
            </IonCol>
        </IonRow>
    </IonItemDivider>
};

export default CartItem;