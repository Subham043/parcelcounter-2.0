import {
    IonPage,
    IonContent,
} from "@ionic/react";
import MainHeader from "../../components/MainHeader";
import Profile from "../../components/Profile";
import PasswordUpdate from "../../components/PasswordUpdate";

const Setting: React.FC = () => {

    return (
        <IonPage>
            <MainHeader isMainHeader={false} name="Setting" />
            <IonContent fullscreen={false} forceOverscroll={false}>
                <Profile />
                <PasswordUpdate />
            </IonContent>
        </IonPage>
    );
};

export default Setting;
