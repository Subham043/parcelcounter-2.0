import { IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonLabel, IonPage, IonRow, IonSegment, IonSegmentButton, IonText } from '@ionic/react';
import './Login.css';
import MainHeader from '../../components/MainHeader';
import { Link } from 'react-router-dom';
import LoginwithEmail from '../../components/Login/LoginWithEmail';
import { useState } from 'react';
import LoginWithPhone from '../../components/Login/LoginWithPhone';

const Login: React.FC = () =>{
    const [loginType, setLoginType] = useState('phone')
    return <IonPage>
        <MainHeader isMainHeader={true} />
        <IonContent
        fullscreen={false}
        forceOverscroll={false}
        >
            <div className='auth-container'>
                <IonCard className='w-100 auth-card'>
                    <IonCardHeader>
                        <IonText color="dark" className="text-center">
                            <h3>LOGIN</h3>
                        </IonText>
                    </IonCardHeader>

                    <IonCardContent>
                        <IonSegment color="dark" mode='ios' value={loginType} onIonChange={(e)=>setLoginType(e.detail.value as string ?? '')}>
                            <IonSegmentButton value="phone">
                                <IonLabel>Login With Phone</IonLabel>
                            </IonSegmentButton>
                            <IonSegmentButton value="email">
                                <IonLabel>Login With Email</IonLabel>
                            </IonSegmentButton>
                        </IonSegment>
                        {loginType==='email' ? <LoginwithEmail /> : <LoginWithPhone />}
                        <IonGrid className="mt-1">
                            <IonRow className="ion-align-items-center ion-justify-content-between">
                            <IonCol size="6">
                                <Link className="no-underline login-link-text" to="/register">
                                    <IonText color="dark">
                                        <p className="login-link-text text-left">
                                            <b>Register</b>
                                        </p>
                                    </IonText>
                                </Link>
                            </IonCol>
                            <IonCol size="6">
                                <Link className="no-underline login-link-text" to="/forgot-password">
                                    <IonText color="dark">
                                        <p className="login-link-text text-right">
                                            <b>Forgot Password?</b>
                                        </p>
                                    </IonText>
                                </Link>
                            </IonCol>
                            </IonRow>
                        </IonGrid>
                    </IonCardContent>
                </IonCard>
            </div>
        </IonContent>
    </IonPage>
}
export default Login