import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonGrid, IonList, IonPage, IonRow, IonSpinner, IonText } from '@ionic/react';
import './Register.css';
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
    name: yup.string().required(),
    phone: yup
      .string()
      .required()
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
    email: yup.string().email().notRequired(),
    password: yup.string().required(),
    confirm_password: yup
      .string()
      .required()
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();  

const fields = [
    {
      placeholder: "Enter name",
      label: "Name",
      type: "text",
      name: "name",
      inputmode: "text",
    },
    {
      placeholder: "Enter email (optional)",
      label: "Email (optional)",
      type: "email",
      name: "email",
      inputmode: "email",
    },
    {
      placeholder: "Enter phone",
      label: "Phone",
      type: "text",
      name: "phone",
      inputmode: "numeric",
    },
    {
      placeholder: "Enter password",
      label: "Password",
      type: "password",
      name: "password",
      inputmode: "text",
    },
    {
      placeholder: "Enter confirm password",
      label: "Confirm Password",
      type: "password",
      name: "confirm_password",
      inputmode: "text",
    },
];

const Register: React.FC = () =>{
    const [loading, setLoading] = useState<boolean>(false);
    const history = useHistory();
    const {toastSuccess, toastError} = useToast();

    const {
        handleSubmit,
        control,
        setValue,
        register,
        getValues,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
          await axiosPublic.post(api_routes.register, getValues());
          toastSuccess("Registration completed successfully.");
          reset({
            name: "",
            phone: "",
            email: "",
            password: "",
            confirm_password: "",
          });
        } catch (error: any) {
          console.log(error);
          if (error?.response?.data?.message) {
            toastError(error?.response?.data?.message);
          }
          if (error?.response?.data?.errors?.name) {
            setError("name", {
              type: "server",
              message: error?.response?.data?.errors?.name[0],
            });
          }
          if (error?.response?.data?.errors?.email) {
            setError("email", {
              type: "server",
              message: error?.response?.data?.errors?.email[0],
            });
          }
          if (error?.response?.data?.errors?.phone) {
            setError("phone", {
              type: "server",
              message: error?.response?.data?.errors?.phone[0],
            });
          }
          if (error?.response?.data?.errors?.password) {
            setError("password", {
              type: "server",
              message: error?.response?.data?.errors?.password[0],
            });
          }
          if (error?.response?.data?.errors?.confirm_password) {
            setError("confirm_password", {
              type: "server",
              message: error?.response?.data?.errors?.confirm_password[0],
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
                            <h3>REGISTER</h3>
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
                                        "Register"
                                    )}
                                </IonButton>
                            </div>
                        </form>
                        <IonButton fill='clear' className="no-underline text-center w-100" onClick={()=>history.goBack()}>
                            <IonText color="dark">
                                <p className="login-link-text text-center">
                                    <b>Already have an account?</b>
                                </p>
                            </IonText>
                        </IonButton>
                    </IonCardContent>
                </IonCard>
            </div>
        </IonContent>
    </IonPage>
}
export default Register