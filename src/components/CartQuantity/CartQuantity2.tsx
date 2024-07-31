import { IonButton, IonIcon, IonInput, IonSpinner, SearchbarInputEventDetail } from "@ionic/react";
import React, { useEffect, useState } from "react";
import './CartQuantity.css';
import { cartOutline } from "ionicons/icons";

type CartQuantityType = {
    quantity:number;
    min_cart_quantity:number;
    loading:boolean;
    incrementQuantity:()=>void;
    decrementQuantity:()=>void;
    changeQuantity:(val:number)=>void;
}

const CartQuantity2: React.FC<CartQuantityType> = ({quantity, min_cart_quantity, loading, incrementQuantity, decrementQuantity, changeQuantity}) => {
    const [qnt, setQnt] = useState(quantity);
    const [load, setLoad] = useState(false);
    useEffect(() => {
        setQnt(quantity);
      return () => {}
    }, [quantity])

    function debounce<Params extends any[]>(
        func: (...args: Params) => any,
        timeout: number,
      ): (...args: Params) => void {
        let timer: NodeJS.Timeout
        return (...args: Params) => {
          clearTimeout(timer)
          timer = setTimeout(() => {
            func(...args)
          }, timeout)
        }
    }

    const debouncedQuatity = debounce(changeQuantity, 500);
    
    const handleChangeQuantity = (val: any) => {
        const data = parseInt(val);
        if(data<min_cart_quantity || isNaN(data)){
            setQnt(min_cart_quantity);
            debouncedQuatity(min_cart_quantity)
        }else{
            setQnt(data);
            debouncedQuatity(data)
        }
    }

    return (quantity===0 ? <IonButton fill='solid' color="dark" className="add-to-cart-btn" disabled={loading} onClick={()=>incrementQuantity()}>
                {loading ? <IonSpinner name="dots" color='dark' /> : <>
                    <IonIcon slot="start" icon={cartOutline}></IonIcon>
                    Add
                </>}
            </IonButton> : 
            <div className="cart-quantity-main-holder">
                <div className="col-cart-quantity-auto">
                    <button color='dark' className="cart-quantity-btn-main cart-quantity-btn-main-minus" disabled={loading} onClick={()=>decrementQuantity()}>
                        {loading ? <IonSpinner name="dots" color='dark' /> : '-'}
                    </button>
                </div>
                <div className="col-cart-quantity-input">
                    <input type="number" inputMode="numeric" aria-label="Quantity" value={qnt} className="cart-quantity-input-main" onChange={(e)=>handleChangeQuantity(e.target.value)} />
                </div>
                <div className="col-cart-quantity-auto">
                    <button color='dark' className="cart-quantity-btn-main cart-quantity-btn-main-plus" disabled={loading} onClick={()=>incrementQuantity()}>
                        {loading ? <IonSpinner name="dots" color='dark' /> : '+'}
                    </button>
                </div>
            </div>);
}

export default CartQuantity2;