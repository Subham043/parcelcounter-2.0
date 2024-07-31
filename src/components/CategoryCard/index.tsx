import { IonCard, IonCardHeader, IonImg, IonSpinner, IonText } from "@ionic/react";
import './CategoryCard.css';
import { Link } from "react-router-dom";
import { useState } from "react";

type Props = {
    text: string;
    link: string;
    image: string;
}

const CategoryCard: React.FC<Props> = ({text, image, link}) => 
{
    const [imgLoading, setImgLoading] = useState<boolean>(true);
    const [imgError, setImgLoadingError] = useState<boolean>(false);
    return <Link className="no-underline" to={link}>
        <IonCard className="category-card">
            {
                imgLoading &&
                <div className="text-center mt-1">
                    <IonSpinner color='dark' />
                </div>
            }
            <IonImg alt="category" src={imgError ? '/images/category-all.webp' : image} class="category-card-image" onIonError={()=>{setImgLoading(false); setImgLoadingError(true)}} onIonImgDidLoad={()=>setImgLoading(false)} />
            <IonCardHeader className="category-card-header">
                <IonText color="dark">
                    <p className="category-card-text">{text}</p>
                </IonText>
            </IonCardHeader>
        </IonCard>
    </Link>
}

export default CategoryCard