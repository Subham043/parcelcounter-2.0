import { IonButton, IonCard, IonCardHeader, IonIcon, IonImg, IonModal, IonSpinner, IonText } from "@ionic/react";
import './ProductCard.css';
import { Link } from "react-router-dom";
import CartQuantity from "../CartQuantity";
import { ProductType } from "../../helper/types";
import { useCart } from "../../hooks/useCart";
import ProductPrice from "../ProductPrice";
import { informationCircle } from "ionicons/icons";
import BulkOffer from "../BulkOffer";
import { useState } from "react";


const ProductCard: React.FC<ProductType> = (props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [imgLoading, setImgLoading] = useState<boolean>(true);
    const [imgError, setImgLoadingError] = useState<boolean>(false);
    const {quantity, cartItemLoading, cart_product_item, incrementQuantity, changeQuantity, decrementQuantity} = useCart({id:props.id, product:props, product_prices:props.product_prices, min_cart_quantity:props.min_cart_quantity, cart_quantity_interval:props.cart_quantity_interval});
    
    return <>
        <IonCard className="product-card">
            <Link className="no-underline" to={`/product-detail/${props.slug}`}>
                {
                    imgLoading &&
                    <div className="text-center mt-1">
                        <IonSpinner color='dark' />
                    </div>
                }
                <IonImg alt="product" src={imgError ? '/images/category-all.webp' : props.image} className="product-card-image" onIonError={()=>{setImgLoading(false); setImgLoadingError(true)}} onIonImgDidLoad={()=>setImgLoading(false)} />
            </Link>
            <IonCardHeader className="product-card-header">
                <IonText color="dark">
                    <p className="product-card-text">{props.name}</p>
                    <IonButton className='product-price-modal-btn' fill="clear" onClick={()=>setIsOpen(true)}>
                        <ProductPrice taxes={props.taxes} product_prices={props.product_prices} cart_quantity_specification={props.cart_quantity_specification} cart_product_item={cart_product_item} />
                        <IonIcon icon={informationCircle} className='product-price-icon' />
                    </IonButton>
                </IonText>
                <CartQuantity quantity={quantity} min_cart_quantity={props.min_cart_quantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} changeQuantity={changeQuantity} loading={cartItemLoading} />
            </IonCardHeader>
        </IonCard>
        <IonModal isOpen={isOpen} onDidDismiss={()=>setIsOpen(false)} id={`product-price-main-modal-${props.id}`} className="post-price-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
            <BulkOffer taxes={props.taxes} product_prices={props.product_prices} cart_quantity_specification={props.cart_quantity_specification} cart_product_item={cart_product_item} />
        </IonModal>
    </>;
    
}

export default ProductCard