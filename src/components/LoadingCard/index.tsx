import { IonCard, IonCol, IonGrid, IonRow } from "@ionic/react";
import './LoadingCard.css';

type Props = {
    column?: number;
    itemCount?: number;
    height?: string;
}

const LoadingCard: React.FC<Props> = ({column=12, itemCount=6, height="110px"}) => {
    const arrayList = Array.from(Array(itemCount).keys());
    return <>
        <IonRow className="ion-align-items-center ion-justify-content-between">
            {
                arrayList.map((i) => <IonCol
                size={column.toString()}
                key={i}
            >
                <IonCard className="loading-card">
                    <div className="card-loading" style={{height}}></div>
                </IonCard>
            </IonCol>)
            }
        </IonRow>
</>
}

export default LoadingCard