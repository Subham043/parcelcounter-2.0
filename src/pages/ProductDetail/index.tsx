import { IonCard, IonCardHeader, IonCol, IonContent, IonGrid, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItemDivider, IonPage, IonRow, IonText} from '@ionic/react';
import './ProductDetail.css';
import MainHeader from '../../components/MainHeader';
import Slider from '../../components/Slider';
import { checkmarkDoneOutline, informationCircleOutline } from 'ionicons/icons';
import CommonHeading from '../../components/CommonHeading';
import ProductCard from '../../components/ProductCard';
import { RouteComponentProps } from 'react-router';
import useSWR from 'swr'
import { ProductType } from '../../helper/types';
import { api_routes } from '../../helper/routes';
import { useCart } from '../../hooks/useCart';
import ProductPrice from '../../components/ProductPrice';
import CartQuantity from '../../components/CartQuantity';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { useCallback, useRef } from 'react';
import useSWRInfinite from "swr/infinite";
import LoadingCard from '../../components/LoadingCard';
import NoData from '../../components/NoData';

const PAGE_SIZE = 20;
interface ProductProps extends RouteComponentProps<{
  slug: string;
}> {}

const ProductDetailCartQuantity = ({product}:{product:ProductType}) => {
  const {quantity, cartItemLoading, incrementQuantity, decrementQuantity, changeQuantity} = useCart({id:product.id, product, product_prices:product.product_prices, min_cart_quantity:product.min_cart_quantity, cart_quantity_interval:product.cart_quantity_interval});
  return <CartQuantity quantity={quantity} min_cart_quantity={product.min_cart_quantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} changeQuantity={changeQuantity} loading={cartItemLoading} />
}

const ProductDetailPrice = ({product}:{product:ProductType}) => {
  const {cart_product_item} = useCart({id:product.id, product, product_prices:product.product_prices, min_cart_quantity:product.min_cart_quantity, cart_quantity_interval:product.cart_quantity_interval});
  return <ProductPrice product_prices={product.product_prices} cart_quantity_specification={product.cart_quantity_specification} cart_product_item={cart_product_item} />
}

const ProductDetailBulkFactor = ({product}:{product:ProductType}) => {
  const {cart_product_item} = useCart({id:product.id, product, product_prices:product.product_prices, min_cart_quantity:product.min_cart_quantity, cart_quantity_interval:product.cart_quantity_interval});
  return <IonCard className='mb-1'>
    <IonCardHeader className='product-detail-card-header'>
        <div className='bulk-offer-wrapper'>
          <IonText>
              <p className="fs-7-note">Note: Prices are inclusive of GST.</p>
          </IonText>
          <IonText>
              <h6>Bulk Offer :</h6>
          </IonText>
          <hr />
          <ul>
            {
                product.product_prices.map((item, i) => <li key={i}>
                    {
                        (cart_product_item().length>0 && item.min_quantity===cart_product_item()[0].product_price.min_quantity) ?
                        <div className="bulk-offer-text bulk-offer-text-active">
                            <IonIcon icon={checkmarkDoneOutline} /> 
                            <span>Buy {item.min_quantity} {product.cart_quantity_specification} or more at &#8377;{item.discount_in_price} / {product.cart_quantity_specification}</span>
                        </div>:
                        <div className="bulk-offer-text">
                            <IonIcon icon={informationCircleOutline} /> 
                            <span>Buy {item.min_quantity} {product.cart_quantity_specification} or more at &#8377;{item.discount_in_price} / {product.cart_quantity_specification}</span>
                        </div>
                    }
                </li>)
            }
          </ul>
        </div>
    </IonCardHeader>
  </IonCard>
}

const ProductDetail: React.FC<ProductProps> = ({match}) => {
  const axiosPrivate = useAxiosPrivate();
  const productRef = useRef<HTMLIonInfiniteScrollElement | null>(null);
  const fetcher = async (url: string) => {
      const res =await axiosPrivate.get(url);
      setTimeout(async() => {
        if(productRef && productRef.current){
          await productRef.current.complete()
        }
      }, 500)
      return res.data.data
  };
  const { data:productData, isLoading:isProductLoading } = useSWR<{product: ProductType}>(api_routes.products + `/${match.params.slug}`);
  const getCategoryStr = () => {
      return productData ? productData.product.categories.map(item => item.id).join('_') : null;
  }

  const getSubCategoryStr = () => {
      return productData ? productData.product.sub_categories.map(item => item.id).join('_') : null;
  }
  const getKey = useCallback((pageIndex:any, previousPageData:any) => {
    setTimeout(async() => {
      if(productRef && productRef.current){
        await productRef.current.complete()
      }
  }, 500)
      if ((previousPageData && previousPageData.length===0) || (previousPageData && previousPageData.length<PAGE_SIZE)) return null;
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
        <MainHeader isMainHeader={false} name={productData ? productData.product.name : 'Product'} />
        <IonContent
          fullscreen={false}
          forceOverscroll={false}
        >
            {
              (isProductLoading) && <LoadingCard itemCount={4} column={12} height='200px' />
            }
            {
              productData && <>
                <Slider images={productData ? [
                  ...productData.product.product_images.map(item => item.image)
                ] : []} />
                <CommonHeading text={productData.product.name} />
                <ProductDetailBulkFactor product={productData.product} />
                {
                  productData.product.product_specifications.length>0 &&
                  <IonCard>
                    <div className='specification-heading'>
                      <h6>Specification</h6>
                    </div>
                    <div>
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
                  </IonCard>
                }
                <CommonHeading text='Related Products' />
                <IonGrid>
                  <IonRow className="ion-align-items-center ion-justify-content-between">
                      {
                          (data ? data.flat(): []).map((item, i) => <IonCol
                              size="6"
                              size-xl="3"
                              size-lg="3"
                              size-md="4"
                              size-sm="6"
                              size-xs="6"
                              key={i}
                          >
                              <ProductCard {...item} />
                          </IonCol>)
                      }
                  </IonRow>
                </IonGrid>
                {
                  (isLoading) && <LoadingCard itemCount={6} column={6} />
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
                <IonItemDivider className="ion-padding cart-divider-total w-100" slot="fixed">
                    <IonRow className="w-100 ion-align-items-center ion-justify-content-between">
                        <IonCol
                            size="6"
                            sizeLg='6'
                            sizeMd='6'
                            sizeSm='6'
                            sizeXl='6'
                            sizeXs='6'
                            className='text-left'
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
                            className='text-right'
                        >
                            <ProductDetailCartQuantity product={productData.product} />
                        </IonCol>
                    </IonRow>
                </IonItemDivider>
              </>
            }
        </IonContent>
    </IonPage>
  );
};

export default ProductDetail;
