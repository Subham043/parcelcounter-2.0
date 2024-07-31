import { IonCardHeader, IonImg, IonText } from "@ionic/react";
import './NoData.css';

type Props = {
    message?: string;
};

const NoData: React.FC<Props> = ({message='No data available.'}) => <div className="centered-section">
    <div className="empty-cart-card">
        <IonImg
            src='/images/no-data.png'
            alt="Logo"
            className="img-empty-cart-card"
        ></IonImg>
        <IonCardHeader className="empty-cart-card-header">
            <IonText color="dark" className="text-center">
                <p>{message}</p>
            </IonText>
        </IonCardHeader>
    </div>
</div>

export default NoData