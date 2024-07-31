import { IonIcon, IonText } from "@ionic/react";
import './RowHeading.css';
import { Link } from "react-router-dom";
import { chevronForwardOutline } from "ionicons/icons";

type Props = {
    text: string;
    link: string;
    inHomePage: boolean
}

const RowHeading: React.FC<Props> = ({text, link, inHomePage}) => <div className="page-padding row-header">
{ inHomePage && <>
    <h3>{text}</h3>
    <Link to={link}><span>Show More</span> <IonIcon icon={chevronForwardOutline} /></Link>
</>}
</div>

export default RowHeading