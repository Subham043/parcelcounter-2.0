import { IonImg, IonSpinner, IonText } from "@ionic/react";
import './SearchCard.css';
import { Link } from "react-router-dom";
import { useState } from "react";

type Props = {
    text: string;
    type: string;
    link: string;
    image: string;
}

const SearchCard: React.FC<Props> = ({text, image, link, type}) => {
    const [imgLoading, setImgLoading] = useState<boolean>(true);
    const [imgError, setImgLoadingError] = useState<boolean>(false);
    return <div className="search-holder">
        <Link className="no-underline search-card" to={link}>
            {
                imgLoading &&
                <div className="search-card-img text-center mt-1">
                    <IonSpinner color='dark' />
                </div>
            }
            <IonImg class='search-card-img' alt="product" src={imgError ? '/images/category-all.webp' : image} onIonError={()=>{setImgLoading(false); setImgLoadingError(true)}} onIonImgDidLoad={()=>setImgLoading(false)} />
            <IonText color="dark" className="search-card-text-wrapper">
                <p className="search-card-text">{text}</p>
                <p className="search-card-price">{type}</p>
            </IonText>
        </Link>
    </div>
}

export default SearchCard