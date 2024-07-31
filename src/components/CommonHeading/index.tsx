import { IonText } from "@ionic/react";
import './CommonHeading.css';

type Props = {
    text: string;
}

const CommonHeading: React.FC<Props> = ({text}) => <IonText color="dark">
    <h2 className='common-heading-text'>{text}</h2>
</IonText>

export default CommonHeading