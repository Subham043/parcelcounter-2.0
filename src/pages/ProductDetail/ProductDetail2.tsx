import {
  IonButton,
  IonCardHeader,
  IonCol,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItemDivider,
  IonPage,
  IonRow,
  IonSpinner,
  IonText,
} from "@ionic/react";
import "./ProductDetail.css";
import MainHeader from "../../components/MainHeader";
import Slider from "../../components/Slider";
import {
  arrowBack,
  arrowForward,
  arrowUpLeftBox,
  checkmarkDoneOutline,
  informationCircleOutline,
  star,
  starSharp,
} from "ionicons/icons";
import CommonHeading from "../../components/CommonHeading";
import { RouteComponentProps } from "react-router";
import useSWR from "swr";
import { ProductReviewResponseType, ProductType } from "../../helper/types";
import { api_routes } from "../../helper/routes";
import { useCart } from "../../hooks/useCart";
import ProductPrice from "../../components/ProductPrice";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { useCallback, useRef, useState } from "react";
import useSWRInfinite from "swr/infinite";
import LoadingCard from "../../components/LoadingCard";
import MainProductCard from "../../components/MainProductCard";
import NoData from "../../components/NoData";
import CartQuantityBtn from "../../components/CartQuantityBtn";
import { useAuth } from "../../context/AuthProvider";
import ProductReviewModal from "../../components/ProductReviewModal";

const PAGE_SIZE = 10;
interface ProductProps
  extends RouteComponentProps<{
    slug: string;
  }> {}

const ProductDetailCartQuantity = ({ product }: { product: ProductType }) => {
  const {
    quantity,
    color,
    cartItemLoading,
    incrementQuantity,
    decrementQuantity,
    changeQuantity,
  } = useCart({
    id: product.id,
    product,
    product_prices: product.product_prices,
    min_cart_quantity: product.min_cart_quantity,
    cart_quantity_interval: product.cart_quantity_interval,
  });
  // return <CartQuantity2 quantity={quantity} min_cart_quantity={product.min_cart_quantity} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} changeQuantity={changeQuantity} loading={cartItemLoading} />
  return (
    <div className="product-detail-page-main-cart-quantity">
      <CartQuantityBtn
        quantity={quantity}
        color={color}
        min_cart_quantity={product.min_cart_quantity}
        cart_quantity_interval={product.cart_quantity_interval}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        changeQuantity={changeQuantity}
        loading={cartItemLoading}
        colors={product.product_colors ?? []}
        product_id={product.id}
        product_name={product.name}
      />
    </div>
  );
};

const ProductDetailPrice = ({ product }: { product: ProductType }) => {
  const { cart_product_item } = useCart({
    id: product.id,
    product,
    product_prices: product.product_prices,
    min_cart_quantity: product.min_cart_quantity,
    cart_quantity_interval: product.cart_quantity_interval,
  });
  return (
    <ProductPrice
      taxes={product.taxes}
      product_prices={product.product_prices}
      cart_quantity_specification={product.cart_quantity_specification}
      cart_product_item={cart_product_item}
    />
  );
};

const ProductDetailBulkFactor = ({ product }: { product: ProductType }) => {
  const { cart_product_item } = useCart({
    id: product.id,
    product,
    product_prices: product.product_prices,
    min_cart_quantity: product.min_cart_quantity,
    cart_quantity_interval: product.cart_quantity_interval,
  });
  return (
    <div className="product-detail-page-main-bulk-factor page-padding mb-1">
      <IonCardHeader className="product-detail-card-header">
        <div className="bulk-offer-wrapper">
          <div className="cart-total-price-heading mb-0 pb-0">
            <h6>Prices are inclusive of GST.</h6>
          </div>
          <div className="section-container mb-0 pb-0 border-bottom-0">
            {product.product_prices.map((item, i) => {
              if (
                cart_product_item().length > 0 &&
                item.min_quantity ===
                  cart_product_item()[0].product_price.min_quantity
              ) {
                return (
                  <div
                    className="product-detail-page-main-specification"
                    key={i}
                  >
                    <IonItemDivider className="specification-divider">
                      <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                        <IonCol size="6" className="text-left">
                          <IonText>
                            <p className="specification-text">
                              <code>Price</code>
                            </p>
                          </IonText>
                        </IonCol>
                        <IonCol size="6" className="text-right">
                          <IonText>
                            <p className="specification-text">
                              <b>
                                <strong style={{ fontFamily: "sans-serif" }}>
                                  ₹
                                </strong>
                                {item.discounted_price.toFixed(2)}
                              </b>
                            </p>
                          </IonText>
                        </IonCol>
                      </IonRow>
                    </IonItemDivider>
                    <IonItemDivider className="specification-divider">
                      <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                        <IonCol size="6" className="text-left">
                          <IonText>
                            <p className="specification-text">
                              {product.taxes.length === 0 && <code>Tax Applied</code>}
                              {product.taxes.map((tax, i) => (
                                <span key={i}>
                                  <code>
                                    {tax.tax_name} ({tax.tax_value}%)
                                  </code>
                                  <br />
                                </span>
                              ))}
                            </p>
                          </IonText>
                        </IonCol>
                        <IonCol size="6" className="text-right">
                          <IonText>
                            <p className="specification-text">
                              <b>
                                <strong style={{ fontFamily: "sans-serif" }}>
                                  ₹
                                </strong>
                                {item.tax_in_price.toFixed(2)}
                              </b>
                            </p>
                          </IonText>
                        </IonCol>
                      </IonRow>
                    </IonItemDivider>
                    <IonItemDivider className="specification-divider">
                      <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                        <IonCol size="6" className="text-left">
                          <IonText>
                            <p className="specification-text">
                              <code>Total</code>
                            </p>
                          </IonText>
                        </IonCol>
                        <IonCol size="6" className="text-right">
                          <IonText>
                            <p className="specification-text">
                              <b>
                                <strong style={{ fontFamily: "sans-serif" }}>
                                  ₹
                                </strong>
                                {item.discount_in_price.toFixed(2)}
                              </b>
                            </p>
                          </IonText>
                        </IonCol>
                      </IonRow>
                    </IonItemDivider>
                  </div>
                );
              } else if (i === 0) {
                return (
                  <div
                    className="product-detail-page-main-specification"
                    key={i}
                  >
                    <IonItemDivider className="specification-divider">
                      <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                        <IonCol size="6" className="text-left">
                          <IonText>
                            <p className="specification-text">
                              <code>Price</code>
                            </p>
                          </IonText>
                        </IonCol>
                        <IonCol size="6" className="text-right">
                          <IonText>
                            <p className="specification-text">
                              <b>
                                <strong style={{ fontFamily: "sans-serif" }}>
                                  ₹
                                </strong>
                                {item.discounted_price.toFixed(2)}
                              </b>
                            </p>
                          </IonText>
                        </IonCol>
                      </IonRow>
                    </IonItemDivider>
                    <IonItemDivider className="specification-divider">
                      <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                        <IonCol size="6" className="text-left">
                          <IonText>
                            <p className="specification-text">
                              {product.taxes.length === 0 && <code>Tax Applied</code>}
                              {product.taxes.map((tax, i) => (
                                <span key={i}>
                                  <code>
                                    {tax.tax_name} ({tax.tax_value}%)
                                  </code>
                                  <br />
                                </span>
                              ))}
                            </p>
                          </IonText>
                        </IonCol>
                        <IonCol size="6" className="text-right">
                          <IonText>
                            <p className="specification-text">
                              <b>
                                <strong style={{ fontFamily: "sans-serif" }}>
                                  ₹
                                </strong>
                                {item.tax_in_price.toFixed(2)}
                              </b>
                            </p>
                          </IonText>
                        </IonCol>
                      </IonRow>
                    </IonItemDivider>
                    <IonItemDivider className="specification-divider">
                      <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                        <IonCol size="6" className="text-left">
                          <IonText>
                            <p className="specification-text">
                              <code>Total</code>
                            </p>
                          </IonText>
                        </IonCol>
                        <IonCol size="6" className="text-right">
                          <IonText>
                            <p className="specification-text">
                              <b>
                                <strong style={{ fontFamily: "sans-serif" }}>
                                  ₹
                                </strong>
                                {item.discount_in_price.toFixed(2)}
                              </b>
                            </p>
                          </IonText>
                        </IonCol>
                      </IonRow>
                    </IonItemDivider>
                  </div>
                );
              }
            })}
          </div>
          <ul>
            {product.product_prices.map((item, i) => (
              <li key={i}>
                {cart_product_item().length > 0 &&
                item.min_quantity ===
                  cart_product_item()[0].product_price.min_quantity ? (
                  <div className="bulk-offer-text bulk-offer-text-active">
                    <IonIcon icon={checkmarkDoneOutline} />
                    <span>
                      Buy {item.min_quantity}{" "}
                      {product.cart_quantity_specification} or more at{" "}
                      <strong style={{ fontFamily: "sans-serif" }}>₹</strong>
                      {item.discount_in_price.toFixed(2)} /{" "}
                      {product.cart_quantity_specification}
                    </span>
                  </div>
                ) : (
                  <div className="bulk-offer-text">
                    <IonIcon icon={informationCircleOutline} />
                    <span>
                      Buy {item.min_quantity}{" "}
                      {product.cart_quantity_specification} or more at{" "}
                      <strong style={{ fontFamily: "sans-serif" }}>₹</strong>
                      {item.discount_in_price.toFixed(2)} /{" "}
                      {product.cart_quantity_specification}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </IonCardHeader>
    </div>
  );
};

const ProductDetail2: React.FC<ProductProps> = ({ match }) => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const productRef = useRef<HTMLIonInfiniteScrollElement | null>(null);
  const [page, setPage] = useState<number>(1);
  const [showModal, setShowModal] = useState<boolean>(false);
  const { data: productData, isLoading: isProductLoading } = useSWR<{
    product: ProductType;
  }>(api_routes.products + `/${match.params.slug}`);
  const {
    data: reviewData,
    isLoading: isReviewLoading,
    mutate,
  } = useSWR<ProductReviewResponseType>(
    api_routes.products + `/${match.params.slug}/reviews?page=${page}&total=5`
  );
  const getCategoryStr = () => {
    return productData
      ? productData.product.categories.map((item) => item.id).join("_")
      : null;
  };

  const getSubCategoryStr = () => {
    return productData
      ? productData.product.sub_categories.map((item) => item.id).join("_")
      : null;
  };

  const fetcher = async (url: string) => {
    const res = await axiosPrivate.get(url);
    setTimeout(async () => {
      if (productRef && productRef.current) {
        await productRef.current.complete();
      }
    }, 500);
    return res.data.data;
  };
  const getKey = useCallback(
    (pageIndex: any, previousPageData: any) => {
      if (
        (previousPageData && previousPageData.length === 0) ||
        (previousPageData && previousPageData.length < PAGE_SIZE)
      ) {
        if (productRef && productRef.current) {
          productRef.current.complete();
        }
        return null;
      }
      return `${api_routes.products}?total=${PAGE_SIZE}&page=${
        pageIndex + 1
      }&sort=id${
        getCategoryStr() ? `&filter[has_categories]=${getCategoryStr()}` : ""
      }${
        getSubCategoryStr()
          ? `&filter[has_sub_categories]=${getSubCategoryStr()}`
          : ""
      }`;
    },
    [productData && productData.product.slug]
  );

  const { data, size, setSize, isLoading } = useSWRInfinite<ProductType>(
    getKey,
    fetcher,
    {
      initialSize: 1,
      revalidateAll: false,
      revalidateFirstPage: false,
      persistSize: false,
      parallel: false,
    }
  );

  return (
    <IonPage>
      <MainHeader
        isMainHeader={false}
        name={productData ? productData.product.name : ""}
      />
      <IonContent fullscreen={false} forceOverscroll={false}>
        {isProductLoading && (
          <LoadingCard itemCount={4} column={12} height="250px" />
        )}
        {productData && (
          <>
            <div className="product-detail-page-main-slider-container">
              <Slider
                images={
                  productData
                    ? [
                        ...productData.product.product_images.map(
                          (item) => item.image
                        ),
                      ]
                    : []
                }
              />
            </div>
            <div>
              <CommonHeading text={productData.product.name} />
              <div className="section-container">
                <ProductDetailBulkFactor product={productData.product} />
                <p className="page-padding product-detail-page-main-description">
                  {productData.product.brief_description}
                </p>
              </div>
              {productData.product.product_specifications.length > 0 && (
                <div className="page-padding section-container pb-1">
                  <div className="specification-heading product-detail-page-main-specification-heading mt-1">
                    <h6>
                      <IonIcon icon={starSharp} />
                      <IonIcon icon={starSharp} />
                      <span>Specification</span>
                      <IonIcon icon={starSharp} />
                      <IonIcon icon={starSharp} />
                    </h6>
                  </div>
                  <div className="product-detail-page-main-specification">
                    {productData.product.product_specifications.map(
                      (item, i) => (
                        <IonItemDivider
                          className="specification-divider"
                          key={i}
                        >
                          <IonRow className="ion-align-items-center ion-justify-content-between w-100">
                            <IonCol size="6" className="text-left">
                              <IonText>
                                <p className="specification-text">
                                  <code>{item.title}</code>
                                </p>
                              </IonText>
                            </IonCol>
                            <IonCol size="6" className="text-right">
                              <IonText>
                                <p className="specification-text">
                                  <b>{item.description}</b>
                                </p>
                              </IonText>
                            </IonCol>
                          </IonRow>
                        </IonItemDivider>
                      )
                    )}
                  </div>
                </div>
              )}
              <div className="page-padding section-container pb-1">
                <div className="specification-heading product-detail-page-main-specification-heading mt-1">
                  <h6>
                    <IonIcon icon={starSharp} />
                    <IonIcon icon={starSharp} />
                    <span>Reviews</span>
                    <IonIcon icon={starSharp} />
                    <IonIcon icon={starSharp} />
                  </h6>
                </div>
                <div className="product-detail-page-main-specification">
                  <div className="review-container">
                    {isReviewLoading ? (
                      <div className="text-center">
                        <IonSpinner name="dots" color="dark" />
                      </div>
                    ) : (
                      <>
                        {reviewData &&
                          reviewData.data.map((item, i) => (
                            <div className="review-card" key={i}>
                              <div className="review-card-image">
                                {item.user_name.charAt(0).toUpperCase()}
                              </div>
                              <div className="review-card-content">
                                <h6 className="m-0">{item.user_name}</h6>
                                <div>
                                  {Array(item.rating)
                                    .fill(0)
                                    .map((item, i) => (
                                      <IonIcon
                                        key={i}
                                        icon={star}
                                        color="warning"
                                      />
                                    ))}
                                </div>
                                {item.comment && (
                                  <p className="m-0">
                                    <i>{item.comment}</i>
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        {reviewData && reviewData.data.length === 0 && (
                          <div className="text-center">
                            <p>No reviews found</p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
                <IonRow className="w-100 ion-align-items-center ion-justify-content-between">
                  <IonCol
                    size="6"
                    sizeLg="6"
                    sizeMd="6"
                    sizeSm="6"
                    sizeXl="6"
                    sizeXs="6"
                    className="text-left p-0"
                  >
                    {auth.authenticated && (
                      <IonButton
                        size="small"
                        color="dark"
                        className="review-btn"
                        onClick={() => setShowModal(true)}
                      >
                        Write a review
                      </IonButton>
                    )}
                  </IonCol>
                  <IonCol
                    size="5"
                    sizeLg="5"
                    sizeMd="5"
                    sizeSm="5"
                    sizeXl="5"
                    sizeXs="5"
                    className="text-right p-0"
                  >
                    {reviewData && (
                      <>
                        <IonButton
                          size="small"
                          color="dark"
                          disabled={reviewData.meta.current_page === 1}
                          onClick={() =>
                            setPage((reviewData.meta.current_page || 0) - 1)
                          }
                        >
                          <IonIcon slot="icon-only" icon={arrowBack}></IonIcon>
                        </IonButton>
                        <IonButton
                          size="small"
                          color="dark"
                          disabled={
                            reviewData.meta.current_page ===
                            reviewData.meta.last_page
                          }
                          onClick={() =>
                            setPage((reviewData.meta.current_page || 0) + 1)
                          }
                        >
                          <IonIcon
                            slot="icon-only"
                            icon={arrowForward}
                          ></IonIcon>
                        </IonButton>
                      </>
                    )}
                  </IonCol>
                </IonRow>
              </div>
            </div>
            <CommonHeading text="Related Products" />
            {(data ? data.flat() : []).map(
              (item, i) =>
                item.id !== productData.product.id && (
                  <MainProductCard {...item} key={i} />
                )
            )}
            {isLoading && (
              <LoadingCard itemCount={3} column={12} height="300px" />
            )}
            {!isLoading && data && data.flat().length === 0 && (
              <NoData message="No product is available!" />
            )}
            <IonInfiniteScroll
              ref={productRef}
              onIonInfinite={(ev) => {
                if (
                  ev.target.scrollTop + ev.target.offsetHeight >=
                  ev.target.scrollHeight
                ) {
                  !isLoading && setSize(size + 1);
                }
              }}
            >
              <IonInfiniteScrollContent
                loadingText="Please wait..."
                loadingSpinner="bubbles"
              ></IonInfiniteScrollContent>
            </IonInfiniteScroll>
            <IonItemDivider
              className="page-padding cart-divider-total w-100"
              slot="fixed"
            >
              <IonRow className="w-100 ion-align-items-center ion-justify-content-between product-detail-main-cart-divider">
                <IonCol
                  size="6"
                  sizeLg="6"
                  sizeMd="6"
                  sizeSm="6"
                  sizeXl="6"
                  sizeXs="6"
                  className="text-left p-0"
                >
                  <IonText color="dark">
                    <p className="product-detail-price m-0">
                      <ProductDetailPrice product={productData.product} />
                    </p>
                  </IonText>
                </IonCol>
                <IonCol
                  size="5"
                  sizeLg="5"
                  sizeMd="5"
                  sizeSm="5"
                  sizeXl="5"
                  sizeXs="5"
                  className="text-right product-detail-page-main-cart-quantity-col p-0"
                >
                  <ProductDetailCartQuantity product={productData.product} />
                </IonCol>
              </IonRow>
            </IonItemDivider>
            <div className="fixed-spacing-2"></div>
            {auth.authenticated && (
              <ProductReviewModal
                slug={productData.product.slug}
                showModal={showModal}
                setShowModal={setShowModal}
                mutate={mutate}
              />
            )}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ProductDetail2;
