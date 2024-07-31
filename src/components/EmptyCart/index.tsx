import { IonButton, IonCard, IonCardHeader, IonImg, IonText } from "@ionic/react";
import './EmptyCart.css';
import { Link } from "react-router-dom";

const EmptyCart: React.FC = () => <IonCard className="empty-cart-card">
    <IonImg
        src='/images/empty_cart.png'
        alt="Logo"
        className="img-empty-cart-card"
    ></IonImg>
    <IonCardHeader className="empty-cart-card-header">
        <IonText color="dark" className="text-center">
            <p>Oops! No products available in cart. Please add products to cart</p>
        </IonText>
        <div className="text-center">
            <Link to="/category">
                <IonButton color="dark" size="small" shape="round" className="empty-cart-card-button">
                    Add Products
                </IonButton>
            </Link>
        </div>
    </IonCardHeader>
</IonCard>

export default EmptyCart