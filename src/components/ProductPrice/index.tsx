import { CartType, OrderProductTaxType, ProductPriceType } from '../../helper/types';
import './ProductPrice.css';

const ProductPrice: React.FC<{
    taxes: OrderProductTaxType[],
    product_prices: ProductPriceType[], 
    cart_quantity_specification: string,
    cart_product_item: () => CartType[]
}> = ({product_prices, cart_quantity_specification, cart_product_item}) => {
    if(cart_product_item().length>0){
        return <p className="product-card-price">
            {cart_product_item()[0].product_price.discount !== 0 && <del><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{cart_product_item()[0].product_price.price.toFixed(2)}</del>}<span><b><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{cart_product_item()[0].product_price.discount_in_price.toFixed(2)}</b> <small> / {cart_quantity_specification}</small></span>
        </p>
    }
    if(product_prices.length > 0){
        const priceArr = [...product_prices];
        const price = priceArr.sort(function(a, b){return a.discount_in_price - b.discount_in_price});
        return <p className="product-card-price">{price[0].discount !== 0 && <del><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{price[0].price.toFixed(2)}</del>}<span><b><strong style={{ fontFamily: 'sans-serif'}}>₹</strong>{price[0].discount_in_price.toFixed(2)}</b> <small> / {cart_quantity_specification}</small></span></p>
    }
    return <p className="product-card-price"></p>
}

export default ProductPrice;