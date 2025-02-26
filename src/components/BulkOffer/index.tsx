import {
  IonCardHeader,
  IonCol,
  IonIcon,
  IonItemDivider,
  IonRow,
  IonText,
} from "@ionic/react";
import "./BulkOffer.css";
import {
  checkmarkDoneOutline,
  informationCircleOutline,
  starSharp,
} from "ionicons/icons";
import {
  CartType,
  OrderProductTaxType,
  ProductPriceType,
} from "../../helper/types";

const BulkOffer: React.FC<{
  taxes: OrderProductTaxType[];
  product_prices: ProductPriceType[];
  cart_quantity_specification: string;
  cart_product_item: () => CartType[];
}> = ({
  product_prices,
  taxes,
  cart_quantity_specification,
  cart_product_item,
}) => {
  return (
    product_prices &&
    product_prices.length > 0 && (
      <div className="product-detail-page-main-bulk-factor page-padding mb-2 mt-2">
        <IonCardHeader className="product-detail-card-header">
          <div className="bulk-offer-wrapper">
            <div className="cart-total-price-heading mb-0 pb-0">
              <h6>Prices are inclusive of GST.</h6>
            </div>
            <div className="section-container mb-0 pb-0 border-bottom-0">
              {product_prices.map((item, i) => {
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
                                {taxes.length === 0 && <code>Tax Applied</code>}
                                {taxes.map((tax, i) => (
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
                                {taxes.length === 0 && <code>Tax Applied</code>}
                                {taxes.map((tax, i) => (
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
              {product_prices.map((item, i) => (
                <li key={i}>
                  {cart_product_item().length > 0 &&
                  item.min_quantity ===
                    cart_product_item()[0].product_price.min_quantity ? (
                    <div className="bulk-offer-text bulk-offer-text-active">
                      <IonIcon icon={checkmarkDoneOutline} />
                      <span>
                        Buy {item.min_quantity} {cart_quantity_specification} or
                        more at{" "}
                        <strong style={{ fontFamily: "sans-serif" }}>₹</strong>
                        {item.discount_in_price} / {cart_quantity_specification}
                      </span>
                    </div>
                  ) : (
                    <div className="bulk-offer-text">
                      <IonIcon icon={informationCircleOutline} />
                      <span>
                        Buy {item.min_quantity} {cart_quantity_specification} or
                        more at{" "}
                        <strong style={{ fontFamily: "sans-serif" }}>₹</strong>
                        {item.discount_in_price} / {cart_quantity_specification}
                      </span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </IonCardHeader>
      </div>
    )
  );
};

export default BulkOffer;
