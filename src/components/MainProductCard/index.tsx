import { IonIcon, IonImg, IonModal, IonSpinner, useIonRouter } from "@ionic/react";
import './MainProductCard.css';
import { ProductType } from "../../helper/types";
import { useCart } from "../../hooks/useCart";
import ProductPrice from "../ProductPrice";
import { informationCircle } from "ionicons/icons";
import BulkOffer from "../BulkOffer";
import { useState } from "react";
import CartQuantity2 from "../CartQuantity/CartQuantity2";
import CartQuantityBtn from "../CartQuantityBtn";


const MainProductCard: React.FC<ProductType> = (props) => {
    const router = useIonRouter();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {quantity, color, cartItemLoading, cart_product_item, incrementQuantity, changeQuantity, decrementQuantity} = useCart({id:props.id, product:props, product_prices:props.product_prices, min_cart_quantity:props.min_cart_quantity, cart_quantity_interval:props.cart_quantity_interval});
    const [imgLoading, setImgLoading] = useState<boolean>(true);
    const [imgError, setImgLoadingError] = useState<boolean>(false);
    
    return <>
        <div className="product-card product-card-main">
            <div className="product-main-link">
                <button className="product-main-img-btn" onClick={()=>router.push(`/product-detail/${props.slug}`)}>
                    {
                        imgLoading &&
                        <div className="text-center img-loader">
                            <IonSpinner color='dark' />
                        </div>
                    }
                    <IonImg alt="product" src={imgError ? '/images/category-all.webp' : props.image} className="product-card-image" onIonError={()=>{setImgLoading(false); setImgLoadingError(true)}} onIonImgDidLoad={()=>setImgLoading(false)} />
                </button>
                <div className="product-text-container-gradient">
                    <div className="page-padding product-card-header-container">
                        <h4>{props.name}</h4>
                    </div>
                    <div className="page-padding product-card-price-container">
                        <div className="col-auto">
                            <ProductPrice product_prices={props.product_prices} taxes={props.taxes} cart_quantity_specification={props.cart_quantity_specification} cart_product_item={cart_product_item} />
                            <button className='product-price-modal-btn' onClick={()=>setIsOpen(true)}>
                                <p>Bulk Offer</p>
                                <IonIcon icon={informationCircle} className='product-price-icon' />
                            </button>
                        </div>
                        <div className="col-auto cart-quantity-col">
                            <CartQuantityBtn quantity={quantity} color={color} min_cart_quantity={props.min_cart_quantity} cart_quantity_interval={props.cart_quantity_interval} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} changeQuantity={changeQuantity} loading={cartItemLoading} colors={props.product_colors ?? []} product_id={props.id} product_name={props.name} />
                            {/* <CartQuantity2 quantity={quantity} min_cart_quantity={props.min_cart_quantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} changeQuantity={changeQuantity} loading={cartItemLoading} /> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <IonModal isOpen={isOpen} onDidDismiss={()=>setIsOpen(false)} id={`product-price-main-modal-${props.id}`} className="post-price-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
            <BulkOffer taxes={props.taxes} product_prices={props.product_prices} cart_quantity_specification={props.cart_quantity_specification} cart_product_item={cart_product_item} />
        </IonModal>
    </>;
    
}

export default MainProductCard