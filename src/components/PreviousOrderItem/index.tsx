import { IonImg, IonLabel, IonSpinner } from "@ionic/react";
import React, { useState } from "react";
import CartQuantity from "../CartQuantity";
import { ProductType } from "../../helper/types";
import { useCart } from "../../hooks/useCart";
import './PreviouseOrderItem.css';
import ProductPrice from "../ProductPrice";

const PreviouseOrderItem: React.FC<ProductType> = (props) => {
    const {quantity, cartItemLoading, cart_product_item, incrementQuantity, changeQuantity, decrementQuantity} = useCart({id:props.id, product:props, product_prices:props.product_prices, min_cart_quantity:props.min_cart_quantity, cart_quantity_interval:props.cart_quantity_interval});
    const [imgLoading, setImgLoading] = useState<boolean>(true);
    const [imgError, setImgLoadingError] = useState<boolean>(false);

    return <>
        <div className="cart-item-container">
            <div className="cart-item-row">
                <div className="cart-item-col">
                    <div className="cart-item-img-container">
                        <div className="p-relative">
                            {
                                imgLoading &&
                                <div className="text-center img-loader">
                                    <IonSpinner color='dark' />
                                </div>
                            }
                            <IonImg alt="product" className='cart-card-item-img' src={imgError ? '/images/category-all.webp' : props.image} onIonError={()=>{setImgLoading(false); setImgLoadingError(true)}} onIonImgDidLoad={()=>setImgLoading(false)} />
                        </div>
                    </div>
                    <div className="cart-item-text-container">
                        <IonLabel className="cart-card-item-text previous-order-item-name">
                            <p>{props.name}</p>
                        </IonLabel>
                        <div className="order-product-card-price-container">
                            <ProductPrice product_prices={props.product_prices} cart_quantity_specification={props.cart_quantity_specification} cart_product_item={cart_product_item} />
                        </div>
                    </div>
                </div>
                <div className="cart-item-quantity previous-order-cart-quantity">
                    <CartQuantity quantity={quantity} min_cart_quantity={props.min_cart_quantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} changeQuantity={changeQuantity} loading={cartItemLoading} />
                </div>
            </div>
        </div>
    </>
};

export default PreviouseOrderItem;