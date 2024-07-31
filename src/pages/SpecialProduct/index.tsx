import { IonContent, IonPage } from '@ionic/react';
import './SpecialProduct.css';
import MainHeader from '../../components/MainHeader';
import SpecialProductSection from '../../components/SpecialProductSection';
import { RouteComponentProps } from 'react-router';
import { useCallback } from 'react';
import ViewCartBtn from '../../components/ViewCartBtn';

interface SpecialProductProps extends RouteComponentProps<{
    slug: "is_featured" | "is_new" | "is_on_sale" | undefined;
}> {}

const SpecialProduct: React.FC<SpecialProductProps> = ({match}) => {

    const name = useCallback<(slug:"is_featured" | "is_new" | "is_on_sale" | undefined)=>string>((slug) => {
        switch (slug) {
            case 'is_featured':
                return "Exclusive Products"
            case 'is_new':
                return "Eco-Friendly Products"
            case 'is_on_sale':
                return "On Demand Products"
            default:
                return "Exclusive Products"
        }
    }, [match.params.slug]) 

    return (
        <IonPage>
            <MainHeader isMainHeader={false} name={name(match.params.slug)} />
            <IonContent
            fullscreen={false}
            forceOverscroll={false}
            >
                <SpecialProductSection inHomePage={false} slug={match.params.slug} name={name(match.params.slug)} />
                <ViewCartBtn />
            </IonContent>
        </IonPage>
    );
};

export default SpecialProduct;
