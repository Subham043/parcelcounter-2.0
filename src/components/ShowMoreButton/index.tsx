import { IonButton, IonCol, IonIcon, IonRow } from "@ionic/react";
import { eyeOutline } from "ionicons/icons";
import { Link } from "react-router-dom";
import './ShowMoreButton.css';

type Props = {
    link: string;
}

const ShowMoreButton: React.FC<Props> = ({link}) => <IonRow className="ion-align-items-center ion-justify-content-center">
    <IonCol
        size="6"
        className='text-center'
    >
        <Link to={link}>
            <IonButton fill='outline' color="dark" className="show-more-button">
                <IonIcon slot="start" icon={eyeOutline}></IonIcon>
                Show More
            </IonButton>
        </Link>
    </IonCol>
</IonRow>

export default ShowMoreButton