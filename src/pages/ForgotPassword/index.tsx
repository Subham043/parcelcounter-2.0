import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonList, IonPage, IonRow, IonSpinner, IonText } from '@ionic/react';
import './ForgotPassword.css';
import MainHeader from '../../components/MainHeader';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import Input from '../../components/Input';
import { axiosPublic } from '../../../axios';
import { api_routes } from '../../helper/routes';
import { useToast } from '../../hooks/useToast';

const schema = yup
  .object({
    email: yup.string().email().required(),
  })
  .required();  

const fields = [
    {
      placeholder: "Enter email",
      label: "Email",
      type: "email",
      name: "email",
      inputmode: "email",
    }
];

const ForgotPassword: React.FC = () =>{
    const [loading, setLoading] = useState<boolean>(false);
    const history = useHistory();
    const {toastSuccess, toastError} = useToast();

    const {
        handleSubmit,
        register,
        getValues,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async (data: any) => {
        setLoading(true);
        try {
          const response = await axiosPublic.post(api_routes.forgot_password, getValues());
          toastSuccess('Logged in seccessfully.');
          reset({
            email: "",
          });
        } catch (error: any) {
          if (error?.response?.data?.message) {
            toastError(error?.response?.data?.message);
          }
          if (error?.response?.data?.errors?.email) {
            setError("email", {
              type: "server",
              message: error?.response?.data?.errors?.email[0],
            });
          }
        } finally {
          setLoading(false);
        }
    };

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
                            <h3>FORGOT PASSWORD</h3>
                        </IonText>
                    </IonCardHeader>

                    <IonCardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <IonList className="ion-no-padding auth-input-item">
                            {fields.map((item, i) => (
                                <Input
                                    {...item}
                                    isAuth={true}
                                    register={register}
                                    errors={errors}
                                    key={i}
                                />
                            ))}
                            </IonList>
                            <div className='text-center'>
                                <IonButton
                                    color="dark"
                                    type="submit"
                                    size='small'
                                    className="mt-1 login-button"
                                >
                                    {loading ? (
                                        <IonSpinner name="crescent"></IonSpinner>
                                    ) : (
                                        "Reset"
                                    )}
                                </IonButton>
                            </div>
                        </form>
                        <IonButton fill='clear' className="no-underline text-center w-100" onClick={()=>history.goBack()}>
                            <IonText color="dark">
                                <p className="login-link-text text-center">
                                    <b>Remember your password?</b>
                                </p>
                            </IonText>
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            </div>
        </IonContent>
    </IonPage>
}
export default ForgotPassword