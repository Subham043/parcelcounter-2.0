import React, { createContext, useCallback, useContext, useEffect } from "react";
import { ChildrenType, CartType as CartDataType, CartChargeType, CartTaxType, CartCouponType } from "../helper/types";
import { api_routes } from "../helper/routes";
import useSWR, { useSWRConfig } from 'swr'
import { useAuth } from "./AuthProvider";
import { axiosPublic } from "../../axios";
import { useBasicCartContext } from "./BasicCartProvider";

export type CartType = {
    cart: CartDataType[];
    cart_charges: CartChargeType[];
    tax: CartTaxType;
    coupon_applied: CartCouponType|null;
    cart_subtotal: number;
    discount_price: number;
    total_charges: number;
    total_price: number;
    total_tax: number;
}
  
export type CartContextType = {
    cart: CartType;
    cartLoading: boolean;
    updateCart: (cartData: CartType) => void;
    fetchCart: () => void;
}

const cartDefaultValues: CartContextType = {
    cart: {
      cart:[],
      cart_charges:[],
      tax: {
        id:0,
        created_at: "",
        updated_at: "",
        tax_in_percentage: 0,
        tax_name: "",
        tax_slug: "",
      },
      coupon_applied: null,
      cart_subtotal: 0, 
      discount_price: 0, 
      total_charges: 0, 
      total_price: 0, 
      total_tax: 0
    },
    updateCart: (cartData: CartType) => {},
    fetchCart: () => {},
    cartLoading: false
};

export const CartContext = createContext<CartContextType>(cartDefaultValues);

export const useCartContext = () => useContext(CartContext);

const CartProvider: React.FC<ChildrenType> = ({children}) => {
    const { auth } = useAuth();
    const { mutate } = useSWRConfig();
    const {cart:basicCart, updateCart: updateBasicCart} = useBasicCartContext();

    const fetcher = useCallback(
      async (url: string) => {
        if(auth.authenticated){
          const headers = {
            headers: {
              "Authorization" : `Bearer ${auth.token}`,
              "Accept": 'application/json'
            }
          }
          const res =  await axiosPublic.get(url,headers)
          return res.data;
        }
        return undefined;
      },
      [auth],
    );

    const { data, isLoading:cartLoading, mutate:updateData } = useSWR<CartType>(auth.authenticated ? api_routes.cart_all : null, fetcher);
    

    const updateCart = async (cartData: CartType) => {
      if(auth.authenticated){
        updateData(cartData);
      }else{
        updateBasicCart(cartData)
      }
    }
    
    const fetchCart = async () => {
      mutate(api_routes.cart_all)
    }

    return (
      <CartContext.Provider value={{
        cart: data ? data : basicCart, 
        updateCart, 
        fetchCart, 
        cartLoading
      }}>
          {children}
      </CartContext.Provider>
    );
}

export default CartProvider;