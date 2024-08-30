import { IonCardHeader, IonCol, IonContent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItemDivider, IonPage, IonRow, IonText} from '@ionic/react';
import './ProductDetail.css';
import MainHeader from '../../components/MainHeader';
import Slider from '../../components/Slider';
import { checkmarkDoneOutline, informationCircleOutline, starSharp } from 'ionicons/icons';
import CommonHeading from '../../components/CommonHeading';
import { RouteComponentProps } from 'react-router';
import useSWR from 'swr'
import { ProductType } from '../../helper/types';
import { api_routes } from '../../helper/routes';
import { useCart } from '../../hooks/useCart';
import ProductPrice from '../../components/ProductPrice';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback, useRef, useState } from 'react';
import useSWRInfinite from "swr/infinite";
import LoadingCard from '../../components/LoadingCard';
import CartQuantity2 from '../../components/CartQuantity/CartQuantity2';
import MainProductCard from '../../components/MainProductCard';
import NoData from '../../components/NoData';
import CartQuantityBtn from '../../components/CartQuantityBtn';

const PAGE_SIZE = 10;
interface ProductProps extends RouteComponentProps<{
  slug: string;
}> {}

const ProductDetailCartQuantity = ({product}:{product:ProductType}) => {
  const {quantity, color, cartItemLoading, incrementQuantity, decrementQuantity, changeQuantity} = useCart({id:product.id, product, product_prices:product.product_prices, min_cart_quantity:product.min_cart_quantity, cart_quantity_interval:product.cart_quantity_interval});
  // return <CartQuantity2 quantity={quantity} min_cart_quantity={product.min_cart_quantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} changeQuantity={changeQuantity} loading={cartItemLoading} />
  return <div className='product-detail-page-main-cart-quantity'>
    <CartQuantityBtn quantity={quantity} color={color} min_cart_quantity={product.min_cart_quantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} changeQuantity={changeQuantity} loading={cartItemLoading} colors={product.product_colors ?? []} product_id={product.id} />
  </div>
}

const ProductDetailPrice = ({product}:{product:ProductType}) => {
  const {cart_product_item} = useCart({id:product.id, product, product_prices:product.product_prices, min_cart_quantity:product.min_cart_quantity, cart_quantity_interval:product.cart_quantity_interval});
  return <ProductPrice product_prices={product.product_prices} cart_quantity_specification={product.cart_quantity_specification} cart_product_item={cart_product_item} />
}

const ProductDetailBulkFactor = ({product}:{product:ProductType}) => {
  const {cart_product_item} = useCart({id:product.id, product, product_prices:product.product_prices, min_cart_quantity:product.min_cart_quantity, cart_quantity_interval:product.cart_quantity_interval});
  return <div className='product-detail-page-main-bulk-factor page-padding mb-1'>
    <IonCardHeader className='product-detail-card-header'>
        <div className='bulk-offer-wrapper'>
          <div className="cart-total-price-heading">
            <h6>Prices are inclusive of GST.</h6>
          </div>
          <ul>
            {
                product.product_prices.map((item, i) => <li key={i}>
                    {
                        (cart_product_item().length>0 && item.min_quantity===cart_product_item()[0].product_price.min_quantity) ?
                        <div className="bulk-offer-text bulk-offer-text-active">
                            <IonIcon icon={checkmarkDoneOutline} /> 
                            <span>Buy {item.min_quantity} {product.cart_quantity_specification} or more at <strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{item.discount_in_price} / {product.cart_quantity_specification}</span>
                        </div>:
                        <div className="bulk-offer-text">
                            <IonIcon icon={informationCircleOutline} /> 
                            <span>Buy {item.min_quantity} {product.cart_quantity_specification} or more at <strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{item.discount_in_price} / {product.cart_quantity_specification}</span>
                        </div>
                    }
                </li>)
            }
          </ul>
        </div>
    </IonCardHeader>
  </div>
}

const ProductDetail2: React.FC<ProductProps> = ({match}) => {
  const axiosPrivate = useAxiosPrivate();
  const productRef = useRef<HTMLIonInfiniteScrollElement | null>(null);
  const { data:productData, isLoading:isProductLoading } = useSWR<{product: ProductType}>(api_routes.products + `/${match.params.slug}`);
  const getCategoryStr = () => {
      return productData ? productData.product.categories.map(item => item.id).join('_') : null;
  }

  const getSubCategoryStr = () => {
      return productData ? productData.product.sub_categories.map(item => item.id).join('_') : null;
  }

  const fetcher = async (url: string) => {
      const res =await axiosPrivate.get(url);
      setTimeout(async() => {
        if(productRef && productRef.current){
          await productRef.current.complete()
        }
      }, 500)
      return res.data.data
  };
  const getKey = useCallback((pageIndex:any, previousPageData:any) => {
      if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) {
        if(productRef && productRef.current){
          productRef.current.complete()
        }
        return null;
      }
      return `${api_routes.products}?total=${PAGE_SIZE}&page=${pageIndex+1}&sort=id${getCategoryStr() ? `&filter[has_categories]=${getCategoryStr()}` : ''}${getSubCategoryStr() ? `&filter[has_sub_categories]=${getSubCategoryStr()}` : ''}`;
  }, [productData && productData.product.slug])
  
  const {
      data,
      size,
      setSize,
      isLoading
  } = useSWRInfinite<ProductType>(getKey, fetcher,{
      initialSize:1,
      revalidateAll: false,
      revalidateFirstPage: false,
      persistSize: false,
      parallel: false
  });

  return (
    <IonPage>
        <MainHeader isMainHeader={false} name={productData ? productData.product.name : ''} />
        <IonContent
          fullscreen={false}
          forceOverscroll={false}
        >
            {
              (isProductLoading) && <LoadingCard itemCount={4} column={12} height='250px' />
            }
            {
              productData && <>
                <div className='product-detail-page-main-slider-container'>
                  <Slider images={productData ? [
                    ...productData.product.product_images.map(item => item.image)
                  ] : []} />
                </div>
                <div>
                  <CommonHeading text={productData.product.name} />
                  <div className="section-container">
                    <ProductDetailBulkFactor product={productData.product} />
                    <p className='page-padding product-detail-page-main-description'>{productData.product.brief_description}</p>
                  </div>
                  {
                    productData.product.product_specifications.length>0 &&
                    <div className='page-padding section-container pb-1'>
                      <div className='specification-heading product-detail-page-main-specification-heading mt-1'>
                        <h6><IonIcon icon={starSharp} /><IonIcon icon={starSharp} /><span>Specification</span><IonIcon icon={starSharp} /><IonIcon icon={starSharp} /></h6>
                      </div>
                      <div className='product-detail-page-main-specification'>
                          {
                            productData.product.product_specifications.map((item, i) => <IonItemDivider className="specification-divider" key={i}>
                                <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                                    <IonCol
                                        size="6"
                                        className='text-left'
                                    >
                                      <IonText>
                                        <p className='specification-text'><code>{item.title}</code></p>
                                      </IonText>
                                    </IonCol>
                                    <IonCol
                                        size="6"
                                        className='text-right'
                                    >
                                      <IonText>
                                        <p className='specification-text'><b>{item.description}</b></p>
                                      </IonText>
                                    </IonCol>
                                </IonRow>
                            </IonItemDivider>)
                          }
                      </div>
                    </div>
                  }
                </div>
                <CommonHeading text='Related Products' />
                {
                  (data ? data.flat(): []).map((item, i) => item.id !== productData.product.id && <MainProductCard {...item} key={i} />)
                }
                {
                  (isLoading) && <LoadingCard itemCount={3} column={12} height='300px' />
                }
                {
                    (!isLoading && data && data.flat().length===0) && <NoData message='No product is available!' />
                }
                <IonInfiniteScroll
                    ref={productRef}
                    onIonInfinite={(ev) => {
                        if (ev.target.scrollTop + ev.target.offsetHeight>= ev.target.scrollHeight ){
                            !isLoading && setSize(size+1);
                        }
                    }}
                >
                  <IonInfiniteScrollContent loadingText="Please wait..." loadingSpinner="bubbles"></IonInfiniteScrollContent>
                </IonInfiniteScroll>
                <IonItemDivider className="page-padding cart-divider-total w-100" slot="fixed">
                    <IonRow className="w-100 ion-align-items-center ion-justify-content-between product-detail-main-cart-divider">
                        <IonCol
                            size="6"
                            sizeLg='6'
                            sizeMd='6'
                            sizeSm='6'
                            sizeXl='6'
                            sizeXs='6'
                            className='text-left p-0'
                        >
                            <IonText color="dark">
                                <p className="product-detail-price m-0"><ProductDetailPrice product={productData.product} /></p>
                            </IonText>
                        </IonCol>
                        <IonCol
                            size="5"
                            sizeLg='5'
                            sizeMd='5'
                            sizeSm='5'
                            sizeXl='5'
                            sizeXs='5'
                            className='text-right product-detail-page-main-cart-quantity-col p-0'
                        >
                            <ProductDetailCartQuantity product={productData.product} />
                        </IonCol>
                    </IonRow>
                </IonItemDivider>
                <div className="fixed-spacing-2"></div>
              </>
            }
        </IonContent>
    </IonPage>
  );
};

export default ProductDetail2;
