import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { ChildrenType, CartType as CartDataType, CartChargeType, CartTaxType, CartCouponType } from "../helper/types";
import { useAuth } from "./AuthProvider";
import { useSWRConfig } from "swr";
import { api_routes } from "../helper/routes";
import { axiosPublic } from "../../axios";

export type BaicCartType = {
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
  
export type BasicCartContextType = {
    cart: BaicCartType;
    updateCart: (cartData: BaicCartType) => void;
}

const cartDefaultValues: BasicCartContextType = {
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
    updateCart: (cartData: BaicCartType) => {},
};

export const BasicCartContext = createContext<BasicCartContextType>(cartDefaultValues);

export const useBasicCartContext = () => useContext(BasicCartContext);

const BasicCartProvider: React.FC<ChildrenType> = ({children}) => {
    const { auth } = useAuth();
    const { mutate } = useSWRConfig();
    const [cart, setCart] = useState<BaicCartType>({
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
    })

    const uploadCartData = useCallback(async ()=>{
      if(auth.authenticated){
        const headers = {
          headers: {
            "Authorization" : `Bearer ${auth.token}`,
            "Accept": 'application/json'
          }
        }
        try {
          cart.cart.map(async (item) => {
            await axiosPublic.post(api_routes.cart_create, {
              product_id: item.product.id,
              product_price_id: item.product_price.id,
              quantity: item.quantity,
              amount: item.amount,
            }, headers);
          });
        } catch (error: any) {
          console.log(error);
        }finally{
          mutate(api_routes.cart_all)
          setCart({
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
          })
        }
      }
    }, [auth.authenticated]);

    useEffect(()=>{
      if(auth.authenticated){
        uploadCartData();
      }
    }, [auth.authenticated, uploadCartData])

    

    const updateCart = async (cartData: BaicCartType) => {
      if(!auth.authenticated){
        setCart(cartData);
      }
    }

    return (
      <BasicCartContext.Provider value={{
        cart, 
        updateCart,
      }}>
          {children}
      </BasicCartContext.Provider>
    );
}

export default BasicCartProvider;