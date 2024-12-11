import {
    IonPage,
    IonContent,
    IonItem,
    IonLabel,
    IonIcon,
    IonSpinner,
    IonItemDivider,
    IonRow,
    IonCol,
    IonButton,
} from "@ionic/react";
import { bagCheckOutline, cogOutline, locationOutline, logOutOutline, mailUnreadOutline, megaphoneOutline, newspaperOutline, peopleCircleOutline } from "ionicons/icons";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { useToast } from "../../hooks/useToast";
import { api_routes } from "../../helper/routes";
import { useAuth } from "../../context/AuthProvider";
import MainHeader from "../../components/MainHeader";
import { LegalResponseType } from "../../helper/types";
import useSWR from 'swr'
import { Browser } from "@capacitor/browser";


const Account: React.FC = () => {

    const { data } = useSWR<LegalResponseType>(api_routes.legal);
    const {logout} = useAuth();
    const [loading, setLoading] = useState<boolean>(false);
    const {toastSuccess, toastError} = useToast();
    const axiosPrivate = useAxiosPrivate();

    const logoutHandler = async() => {
        setLoading(true);
        try {
          await axiosPrivate.post(api_routes.logout, {});
          logout();
          toastSuccess('Logged out successfully.');
        } catch (error: any) {
            toastError('Something went wrong. Please try again later!');
        }finally {
            setLoading(false);
        }
    }

    const loadPage = async(url:string) =>{
        await Browser.open({ url });
    }
    return (
        <IonPage>
            <MainHeader isMainHeader={true} />
            <IonContent fullscreen={false} forceOverscroll={false}>
                <Link className="no-underline" to="/setting">
                    <IonItem lines="full" detail={true}>
                        <IonLabel>Setting</IonLabel>
                        <IonIcon icon={cogOutline} slot="start"></IonIcon>
                    </IonItem>
                </Link>
                <Link className="no-underline" to="/billing-information">
                    <IonItem lines="full" detail={true}>
                        <IonLabel>Billing Information</IonLabel>
                        <IonIcon icon={peopleCircleOutline} slot="start"></IonIcon>
                    </IonItem>
                </Link>
                <Link className="no-underline" to="/billing-address">
                    <IonItem lines="full" detail={true}>
                        <IonLabel>Delivery Address</IonLabel>
                        <IonIcon icon={locationOutline} slot="start"></IonIcon>
                    </IonItem>
                </Link>
                <Link className="no-underline" to="/orders">
                    <IonItem lines="full" detail={true}>
                        <IonLabel>Orders</IonLabel>
                        <IonIcon icon={bagCheckOutline} slot="start"></IonIcon>
                    </IonItem>
                </Link>
                <Link className="no-underline" to="/contact">
                    <IonItem lines="full" detail={true}>
                        <IonLabel>Contact Us</IonLabel>
                        <IonIcon icon={mailUnreadOutline} slot="start"></IonIcon>
                    </IonItem>
                </Link>
                <Link className="no-underline" to="/promotion">
                    <IonItem lines="full" detail={true}>
                        <IonLabel>Promotion</IonLabel>
                        <IonIcon icon={megaphoneOutline} slot="start"></IonIcon>
                    </IonItem>
                </Link>
                {
                    data?.legal.map((item, i) => <IonItem lines="full" detail={true} onClick={()=>loadPage(`https://parcelcounter.in/legal/${item.slug}`)} key={i}>
                        <IonLabel>{item.page_name}</IonLabel>
                        <IonIcon icon={newspaperOutline} slot="start"></IonIcon>
                    </IonItem>)
                }

                <IonItemDivider className="view-cart-checkout-btn-main-container page-padding" slot="fixed">
                    <IonRow className="ion-align-items-center ion-justify-content-center p-0 w-100">
                        <IonCol
                            size="12"
                            className='text-right'
                        >
                            <IonButton className="pagination-btn m-0" fill='solid' color="danger" onClick={logoutHandler} disabled={loading}>
                            {loading ? (
                                <IonSpinner name="crescent" color='light'></IonSpinner>
                            ) : (
                                <>
                                    <IonIcon icon={logOutOutline} slot="start"></IonIcon>
                                    Logout
                                </>
                            )}
                            </IonButton>
                        </IonCol>
                    </IonRow>
                </IonItemDivider>

            </IonContent>
        </IonPage>
    );
};

export default Account;
