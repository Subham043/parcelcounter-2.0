import { IonButton, IonCol, IonIcon, IonRow } from "@ionic/react";
import { eyeOutline } from "ionicons/icons";
import './LoadMoreButton.css';

type Props = {
    clickHandler: ()=>void;
}

const LoadMoreButton: React.FC<Props> = ({clickHandler}) => <IonRow className="ion-align-items-center ion-justify-content-center">
    <IonCol
        size="6"
        className='text-center'
    >
        <IonButton fill='outline' color="dark" className="load-more-button" onClick={clickHandler}>
            Load More
        </IonButton>
    </IonCol>
</IonRow>

export default LoadMoreButton