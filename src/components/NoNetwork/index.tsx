import { IonButton, IonCard, IonCardHeader, IonContent, IonImg, IonPage, IonText } from "@ionic/react";
import './NoNetwork.css';
import { Link } from "react-router-dom";

const NoNetwork: React.FC = () => <IonPage>
        <IonContent>
            <div className="centered-section">
                    <IonCard className="empty-cart-card">
                    <IonImg
                        src='/images/no-signal.png'
                        alt="Logo"
                        className="img-empty-cart-card"
                    ></IonImg>
                    <IonCardHeader className="empty-cart-card-header">
                        <IonText color="dark" className="text-center">
                            <p>Oops! You are offline. Please check your internet connection</p>
                        </IonText>
                    </IonCardHeader>
                </IonCard>
            </div>
        </IonContent>
    </IonPage>

export default NoNetwork