import { FC, useEffect, useState } from "react";
import './CartQuantityBtn.css';
import { IonIcon, IonModal, IonSpinner } from "@ionic/react";
import { cartOutline, createOutline } from "ionicons/icons";
import { ProductColorType } from "../../helper/types";

type CartQuantityType = {
    product_id:number;
    quantity:number;
    color:string|null;
    min_cart_quantity:number;
    loading:boolean;
    incrementQuantity:(color?: string | null)=>void;
    decrementQuantity:(color?: string | null)=>void;
    changeQuantity:(val:number, color?: string | null)=>void;
    colors: ProductColorType[];
}

const AddBtn:FC<{loading:boolean, incrementQuantity:()=>void}> = ({loading, incrementQuantity}) => {
 return <button className="add-btn-3" disabled={loading} onClick={incrementQuantity}>
  {
   loading ? <IonSpinner name="dots" color='dark' className="cart-quantity-btn-add-3-spinner" /> : <>
    <IonIcon slot="start" icon={cartOutline} className="add-btn-3-svg-icon"></IonIcon>
     <span>Add</span>
   </>
  }
 </button>
}

const EditBtn:FC<{setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}> = ({setIsOpen}) => {
 return <button className="edit-btn-3" onClick={() => setIsOpen(true)}>
  <IonIcon slot="start" icon={createOutline} className="edit-btn-3-svg-icon"></IonIcon>
 </button>
}

const CartBtn:FC<{setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; loading: boolean; quantity: number; color: string | null; incrementQuantity: (color?: string | null) => void; decrementQuantity: (color?: string | null) => void}> = ({setIsOpen, loading, quantity, color, incrementQuantity, decrementQuantity}) => {
 return <div className="cart-quantity-btn-main-3">
  <button className="cart-quantity-btn-minus-3" disabled={loading} onClick={() => decrementQuantity(color)}>
   {
    loading ? <IonSpinner name="dots" color='dark' className="cart-quantity-btn-add-3-spinner" /> : <>-</>
   }
   </button>
  <p className="cart-quantity-input-3" onClick={() => setIsOpen(true)}>{quantity}</p>
  <button className="cart-quantity-btn-add-3" disabled={loading} onClick={() => incrementQuantity(color)}>
   {
    loading ? <IonSpinner name="dots" color='dark' className="cart-quantity-btn-add-3-spinner" /> : <>+</>
   }
  </button>
 </div>
}

const CartEditorBtn:FC<{loading: boolean; quantity: number; color: string | null; incrementQuantity: (color?: string | null) => void; decrementQuantity: (color?: string | null) => void; handleValueChange: (val:number) => void}> = ({loading, quantity, color, incrementQuantity, decrementQuantity, handleValueChange}) => {
 const[value, setValue] = useState<number>(0);

 useEffect(() => {
  setValue(quantity);
 }, [quantity])

 useEffect(() => {
  handleValueChange(value);
 }, [value])

 return <div className="cart-quantity-btn-main-3">
  <button className="cart-quantity-btn-minus-3" disabled={loading} onClick={() => decrementQuantity(color)}>
   {
    loading ? <IonSpinner name="dots" color='dark' className="cart-quantity-btn-add-3-spinner" /> : <>-</>
   }
   </button>
  <input className="cart-quantity-input-3" inputMode="numeric" value={value} onChange={(e) => setValue(isNaN(parseInt(e.target.value ?? 0)) ? 0 : parseInt(e.target.value ?? 0))} />
  <button className="cart-quantity-btn-add-3" disabled={loading} onClick={() => incrementQuantity(color)}>
   {
    loading ? <IonSpinner name="dots" color='dark' className="cart-quantity-btn-add-3-spinner" /> : <>+</>
   }
  </button>
 </div>
}

const CartQuantityModalBtn:FC<{setIsOpen: React.Dispatch<React.SetStateAction<boolean>>; loading: boolean; quantity: number; color: string | null; incrementQuantity: (color?: string | null) => void; decrementQuantity: (color?: string | null) => void}> = ({setIsOpen, loading, quantity, color, incrementQuantity, decrementQuantity}) => {
 return <div className="cart-quantity-modal-btn-3">
  <EditBtn setIsOpen={setIsOpen} />
  <CartBtn setIsOpen={setIsOpen} loading={loading} quantity={quantity} color={color} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} />
 </div>
}

const CartQuantityModal:FC<CartQuantityType & {isOpen:boolean, setIsOpen: React.Dispatch<React.SetStateAction<boolean>>}> = ({isOpen, color, colors, setIsOpen, quantity, min_cart_quantity, loading, product_id, incrementQuantity, decrementQuantity, changeQuantity}) => {
 const [selectedColor, setSelectedColor] = useState<string|null>(null);
 const [quantityValue, setQuantityValue] = useState<number>(0);
 useEffect(() => {
  if(color) setSelectedColor(color);
 }, [color])

 const handleValueChange = (value: number) => {
    setQuantityValue(value);
  };
 const updateQuantity = () => {
  // if(quantityValue < min_cart_quantity)
  changeQuantity(quantityValue, selectedColor ?? null);
  setIsOpen(false);
 }

 useEffect(() => {
  if(quantity < 1 && colors.length===0) {
   setIsOpen(false);
  }
 }, [quantity])

 return <div className="cart-quantity-modal">
  <IonModal isOpen={isOpen} onDidDismiss={()=>setIsOpen(false)} id={`cart-quantity-edit-main-modal-${product_id}`} className="cart-quantity-modal-main" initialBreakpoint={1} breakpoints={[0, 1]}>
    <div className="page-padding cart-quantity-modal-main-container">
     <div className="cart-quantity-modal-main-header">
      <p className="cart-quantity-modal-main-title">Container</p>
      <p className="cart-quantity-modal-main-subtitle"><code>Minimum Cart Quantity: </code>{min_cart_quantity}</p>
     </div>
     {colors.length>0 && <div className="cart-quantity-modal-main-body">
       <p className="cart-quantity-modal-main-color-title">Pick a Color:</p>
       <div className="cart-quantity-modal-main-color-container">
          {colors.map((color) => <div className={`cart-quantity-modal-main-color-inactive ${selectedColor===color.code ? 'color-active' : ''}`} key={color.id} onClick={() => setSelectedColor(color.code ?? null)}>
           <div className="cart-quantity-modal-main-color"><span style={{backgroundColor:color.code ?? 'white'}} /> {color.name}</div>
          </div>)}
       </div>
     </div>}
     <div className="cart-quantity-btn-3 cart-quantity-btn-modal-3">
      {
       quantity===0 ? ((colors.length===0 || selectedColor!==null) && <AddBtn loading={loading} incrementQuantity={() => incrementQuantity(selectedColor)} />) : <>
        <CartEditorBtn loading={loading} quantity={quantity} color={selectedColor} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} handleValueChange={handleValueChange} />
        {(quantity >= min_cart_quantity && quantityValue >= min_cart_quantity) && <button className="cart-quantity-btn-modal-add-3" disabled={loading} onClick={updateQuantity}>
         {
          loading ? <IonSpinner name="dots" color='light' className="cart-quantity-btn-add-3-spinner" /> : <>UPDATE</>
         }
        </button>}
       </>
      }
     </div>
    </div>
  </IonModal>
 </div>
}

const CartQuantityBtn:FC<CartQuantityType> = ({quantity, color, colors, min_cart_quantity, product_id, loading, incrementQuantity, decrementQuantity, changeQuantity}) => {
 const [isOpen, setIsOpen] = useState<boolean>(false);
 return <div className="cart-quantity-btn-3">
  {quantity===0 ? 
   (colors.length===0 ? <AddBtn loading={loading} incrementQuantity={() => incrementQuantity(null)} /> : <AddBtn loading={loading} incrementQuantity={() => setIsOpen(true)} />) : 
   <CartQuantityModalBtn setIsOpen={setIsOpen} loading={loading} quantity={quantity} color={color} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} />
  }
   <CartQuantityModal isOpen={isOpen} setIsOpen={setIsOpen} colors={colors} color={color} product_id={product_id} quantity={quantity} min_cart_quantity={min_cart_quantity} loading={loading} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} changeQuantity={changeQuantity} />
 </div>
}

export default CartQuantityBtn;