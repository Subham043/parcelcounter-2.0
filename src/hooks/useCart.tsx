import { useCallback, useEffect, useState } from "react";
import { useAxiosPrivate } from "./useAxiosPrivate";
import { useToast } from "./useToast";
import { CartType, ProductPriceType, ProductType } from "../helper/types";
import { useCartContext } from "../context/CartProvider";
import { api_routes } from "../helper/routes";
import { useAuth } from "../context/AuthProvider";
import { useBasicCartContext } from "../context/BasicCartProvider";

type CartInput = {
    product_id: number;
    product_price_id: number;
    quantity: number;
    amount: number;
}

type BasicCartInput = {
    product: ProductType;
    product_price: ProductPriceType;
    quantity: number;
    amount: number;
}

export function useCart({
    id,
    product,
    product_prices,
    cart_quantity_interval,
    min_cart_quantity
}:{
    id: number,
    product: ProductType,
    product_prices: ProductPriceType[],
    cart_quantity_interval: number,
    min_cart_quantity: number,
}){
    const [quantity, setQuantity] = useState<number>(0);
    
    const { cart, cartLoading, updateCart } = useCartContext();
    const { cart:basicCart, updateCart: updateBasicCart } = useBasicCartContext();
    const [cartItemLoading, setCartItemLoading] = useState<boolean>(false);
    const {auth} = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const { toastSuccess, toastError } = useToast();

    const cart_product_item = useCallback(
      () => cart.cart.filter(item=>item.product.id===id),
      [id, cart.cart],
    )
      
    const basic_cart_product_item = useCallback(
      () => basicCart.cart.filter(item=>item.product.id===id),
      [id, basicCart.cart],
    )

    useEffect(() => {
      if(auth.authenticated){
        setQuantity(cart_product_item().length===0 ? 0 : cart_product_item()[0].quantity)
      }else{
        setQuantity(basic_cart_product_item().length===0 ? 0 : basic_cart_product_item()[0].quantity)
      }
    
      return () => {}
    }, [cart.cart, id, auth, basicCart.cart])

    const incrementQuantity = () => {
      if(auth.authenticated){
        const cart_product = cart_product_item();
        const priceArr = [...product_prices];
        const price_des_quantity = priceArr.sort(function(a, b){return b.min_quantity - a.min_quantity});
        const price = price_des_quantity.filter(item=>(quantity+cart_quantity_interval)>=item.min_quantity).length>0 ? price_des_quantity.filter(item=>(quantity+cart_quantity_interval)>=item.min_quantity)[0] : price_des_quantity[price_des_quantity.length-1];
        if(cart_product.length===0){
            addItemCart({
                product_id: id,
                product_price_id: price.id,
                quantity: min_cart_quantity,
                amount: (min_cart_quantity)*price.discount_in_price,
            })
        }else{
            updateItemCart({
                cartItemId: cart_product[0].id,
                product_id: id,
                product_price_id: price.id,
                quantity: quantity+cart_quantity_interval,
                amount: (quantity+cart_quantity_interval)*price.discount_in_price,
            })
        }
      }else{
        const cart_product = basic_cart_product_item();
        const priceArr = [...product_prices];
        const price_des_quantity = priceArr.sort(function(a, b){return b.min_quantity - a.min_quantity});
        const price = price_des_quantity.filter(item=>(quantity+cart_quantity_interval)>=item.min_quantity).length>0 ? price_des_quantity.filter(item=>(quantity+cart_quantity_interval)>=item.min_quantity)[0] : price_des_quantity[price_des_quantity.length-1];
        if(cart_product.length===0){
            addItemBasicCart({
                product: product,
                product_price: price,
                quantity: min_cart_quantity,
                amount: (min_cart_quantity)*price.discount_in_price,
            })
        }else{
            updateItemBasicCart({
                product: product,
                product_price: price,
                quantity: quantity+cart_quantity_interval,
                amount: (quantity+cart_quantity_interval)*price.discount_in_price,
            })
        }
      }
    };
    
    const changeQuantity = (value:number) => {
      if(auth.authenticated){
        const cart_product = cart_product_item();
        const priceArr = [...product_prices];
        const price_des_quantity = priceArr.sort(function(a, b){return b.min_quantity - a.min_quantity});
        const price = price_des_quantity.filter(item=>(value)>=item.min_quantity).length>0 ? price_des_quantity.filter(item=>(value)>=item.min_quantity)[0] : price_des_quantity[price_des_quantity.length-1];
        updateItemCart({
            cartItemId: cart_product[0].id,
            product_id: id,
            product_price_id: price.id,
            quantity: value,
            amount: (value)*price.discount_in_price,
        })
      }else{
        const priceArr = [...product_prices];
        const price_des_quantity = priceArr.sort(function(a, b){return b.min_quantity - a.min_quantity});
        const price = price_des_quantity.filter(item=>(value)>=item.min_quantity).length>0 ? price_des_quantity.filter(item=>(value)>=item.min_quantity)[0] : price_des_quantity[price_des_quantity.length-1];
        updateItemBasicCart({
            product: product,
            product_price: price,
            quantity: value,
            amount: (value)*price.discount_in_price,
        })
      }
    };
    
    const decrementQuantity = () => {
      if(auth.authenticated){
        const cart_product = cart_product_item();
        const priceArr = [...product_prices];
        const price_des_quantity = priceArr.sort(function(a, b){return b.min_quantity - a.min_quantity});
        const price = price_des_quantity.filter(item=>(Math.max(0, quantity-cart_quantity_interval))>=item.min_quantity).length>0 ? price_des_quantity.filter(item=>(Math.max(0, quantity-cart_quantity_interval))>=item.min_quantity)[0] : price_des_quantity[price_des_quantity.length-1];
        if(cart_product.length!==0 && Math.max(0, quantity-cart_quantity_interval)!==0){
            updateItemCart({
                cartItemId: cart_product[0].id,
                product_id: id,
                product_price_id: price.id,
                quantity: Math.max(0, quantity-cart_quantity_interval),
                amount: (Math.max(0, quantity-cart_quantity_interval))*price.discount_in_price,
            })
        }else{
            deleteItemCart(cart_product[0].id)
        }
      }else{
        const cart_product = basic_cart_product_item();
        const priceArr = [...product_prices];
        const price_des_quantity = priceArr.sort(function(a, b){return b.min_quantity - a.min_quantity});
        const price = price_des_quantity.filter(item=>(Math.max(0, quantity-cart_quantity_interval))>=item.min_quantity).length>0 ? price_des_quantity.filter(item=>(Math.max(0, quantity-cart_quantity_interval))>=item.min_quantity)[0] : price_des_quantity[price_des_quantity.length-1];
        if(cart_product.length!==0 && Math.max(0, quantity-cart_quantity_interval)!==0){
            updateItemBasicCart({
                product: product,
                product_price: price,
                quantity: Math.max(0, quantity-cart_quantity_interval),
                amount: (Math.max(0, quantity-cart_quantity_interval))*price.discount_in_price,
            })
        }else{
            deleteItemBasicCart(cart_product[0].product.id)
        }
      }
    };

    const addItemCart = async (data: CartInput) => {
        if(auth.authenticated){
            setCartItemLoading(true);
            try {
              const response = await axiosPrivate.post(api_routes.cart_create, data);
              updateCart({cart: [...cart.cart, response.data.cart], cart_charges: [...response.data.cart_charges], coupon_applied: response.data.coupon_applied, tax: response.data.tax, cart_subtotal:response.data.cart_subtotal, discount_price: response.data.discount_price, total_charges: response.data.total_charges, total_price: response.data.total_price, total_tax: response.data.total_tax});
              toastSuccess("Item added to cart.");
            } catch (error: any) {
              console.log(error);
              toastError("Something went wrong. Please try again later!");
            }finally{
              setCartItemLoading(false);
            }
        }else{
          loginHandler("Please log in to add the item to cart.");
        }
    }
    
    const addItemBasicCart = async (data: BasicCartInput) => {
        if(!auth.authenticated){
          const main_cart = [...basicCart.cart, {
            product: data.product,
            product_price: data.product_price,
            created_at: '',
            updated_at: '',
            id: data.product.id,
            quantity: data.quantity,
            amount: Number(data.amount.toFixed(2)),
          }];
          const cart_price_total = Number(main_cart.reduce((total:number, next:CartType) => {return total + next.amount}, 0).toFixed(2))
          updateBasicCart({cart: main_cart, cart_charges: [...basicCart.cart_charges], coupon_applied: basicCart.coupon_applied, tax: basicCart.tax, cart_subtotal:cart_price_total, discount_price: basicCart.discount_price, total_charges: basicCart.total_charges, total_price: cart_price_total, total_tax: basicCart.total_tax});
          toastSuccess("Item added to cart.");
        }
    }
    
    const updateItemCart = async ({cartItemId, ...data}: CartInput & {cartItemId:number}) => {
        if(auth.authenticated){
            setCartItemLoading(true);
            try {
              const response = await axiosPrivate.post(api_routes.cart_update + `/${cartItemId}`, data);
              var cartItemIndex = cart.cart.findIndex(function(c) { 
                return c.id == cartItemId; 
              });
              const old_cart = cart.cart;
              old_cart[cartItemIndex] = response.data.cart;
              updateCart({cart: [...old_cart], cart_charges: [...response.data.cart_charges], coupon_applied: response.data.coupon_applied, tax: response.data.tax, cart_subtotal:response.data.cart_subtotal, discount_price: response.data.discount_price, total_charges: response.data.total_charges, total_price: response.data.total_price, total_tax: response.data.total_tax});
              // toastSuccess("Item quantity updated in cart.");
            } catch (error: any) {
              console.log(error);
              toastError("Something went wrong. Please try again later!");
            }finally{
              setCartItemLoading(false);
            }
        }else{
          loginHandler("Please log in to update the item in cart.");
        }
    }
    
    const updateItemBasicCart = async (data: BasicCartInput) => {
        if(!auth.authenticated){
          var cartItemIndex = cart.cart.findIndex(function(c) { 
            return c.product.id == data.product.id; 
          });
          const old_cart = cart.cart;
          old_cart[cartItemIndex] = {
            product: data.product,
            product_price: data.product_price,
            created_at: '',
            updated_at: '',
            id: data.product.id,
            quantity: data.quantity,
            amount: Number(data.amount.toFixed(2)),
          };
          const cart_price_total = Number(old_cart.reduce((total:number, next:CartType) => {return total + next.amount}, 0).toFixed(2))
          updateCart({cart: [...old_cart], cart_charges: [...basicCart.cart_charges], coupon_applied: basicCart.coupon_applied, tax: basicCart.tax, cart_subtotal:cart_price_total, discount_price: basicCart.discount_price, total_charges: basicCart.total_charges, total_price: cart_price_total, total_tax: basicCart.total_tax});
        }
    }
    
    const deleteItemCart = async (data: number) => {
        if(auth.authenticated){
            setCartItemLoading(true);
            try {
              const response = await axiosPrivate.delete(api_routes.cart_delete + `/${data}`);
                const removedItemArray = cart.cart.filter(item => item.id !== data);
                updateCart({cart: [...removedItemArray], cart_charges: [...response.data.cart_charges], coupon_applied: response.data.coupon_applied, tax: response.data.tax, cart_subtotal:response.data.cart_subtotal, discount_price: response.data.discount_price, total_charges: response.data.total_charges, total_price: response.data.total_price, total_tax: response.data.total_tax});
                toastSuccess("Item removed from cart.");
            } catch (error: any) {
              console.log(error);
              toastError("Something went wrong. Please try again later!");
            }finally{
              setCartItemLoading(false);
            }
        }else{
          loginHandler("Please log in to remove the item from cart.");
        }
    }
    
    const deleteItemBasicCart = async (data: number) => {
        if(!auth.authenticated){
          const removedItemArray = basicCart.cart.filter(item => item.product.id !== data);
          const cart_price_total = Number(removedItemArray.reduce((total:number, next:CartType) => {return total + next.amount}, 0).toFixed(2))
          updateCart({cart: [...removedItemArray], cart_charges: [...basicCart.cart_charges], coupon_applied: basicCart.coupon_applied, tax: basicCart.tax, cart_subtotal:cart_price_total, discount_price: basicCart.discount_price, total_charges: basicCart.total_charges, total_price: cart_price_total, total_tax: basicCart.total_tax});
          toastSuccess("Item removed from cart.");
        }
    }

    const loginHandler = (msg:string) => {
        toastError(msg);
    }

    return {
        quantity,
        cartLoading,
        cartItemLoading,
        cart_product_item,
        incrementQuantity,
        changeQuantity,
        decrementQuantity,
        deleteItemCart
    };
}