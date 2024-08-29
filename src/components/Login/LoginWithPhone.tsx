import { IonButton, IonInput, IonItem, IonList, IonSpinner } from '@ionic/react';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { axiosPublic } from '../../../axios';
import { api_routes } from '../../helper/routes';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthProvider';
import { useSWRConfig } from 'swr';
import { ErrorMessage } from '@hookform/error-message';

const schema = yup
 .object({
  phone: yup
      .string()
      .required()
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
  otp: yup
      .string()
      .required()
      .min(4, "Must be exactly 4 digits")
      .max(4, "Must be exactly 4 digits"),
 })
 .required();

const LoginWithPhone: React.FC = () => {
 const [loading, setLoading] = useState<boolean>(false);
 const [otpLoading, setOtpLoading] = useState<boolean>(false);
 const { setAuth } = useAuth();
 const { toastSuccess, toastError } = useToast();
 const { mutate } = useSWRConfig();

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
   const response = await axiosPublic.post(api_routes.login_phone, getValues());
   toastSuccess('Logged in seccessfully.');
   reset({
    phone: "",
    otp: "",
   });
   setAuth({
    auth: {
     authenticated: true,
     token: response.data.token,
     token_type: response.data.token_type,
     user: response.data.user
    }
   })
   mutate(api_routes.cart_all)
  } catch (error: any) {
   if (error?.response?.data?.message) {
    toastError(error?.response?.data?.message);
   }
   if (error?.response?.data?.errors?.phone) {
    setError("phone", {
     type: "server",
     message: error?.response?.data?.errors?.phone[0],
    });
   }
   if (error?.response?.data?.errors?.otp) {
    setError("otp", {
     type: "server",
     message: error?.response?.data?.errors?.otp[0],
    });
   }
  } finally {
   setLoading(false);
  }
 };

 const onSendOtp = async () => {
        if(getValues().phone.length < 1){
            setError("phone", {
              type: "server",
              message: "Phone number is required",
            });
            return ;
        }
        if(getValues().phone.length < 10 || getValues().phone.length > 10){
            setError("phone", {
              type: "server",
              message: "Must be exactly 10 digits",
            });
            return ;
        }
        setError("phone", {
            type: "server",
            message: undefined,
        });
        setOtpLoading(true);
        try {
          await axiosPublic.post(api_routes.login_phone_otp, {phone: getValues().phone});
          toastSuccess("Otp sent successfully.");                 
        } catch (error: any) {
          console.log(error);
          if (error?.response?.data?.message) {
            toastError(error?.response?.data?.message);
          }
          if (error?.response?.data?.errors?.phone) {
            setError("phone", {
              type: "server",
              message: error?.response?.data?.errors?.phone[0],
            });
          }
        } finally {
          setOtpLoading(false);
        }
    }

 return <form onSubmit={handleSubmit(onSubmit)}>
  <IonList className="ion-no-padding auth-input-item">
   <>
       <IonItem className={`ion-no-padding auth-input-item`}>
           <IonInput 
               className="ion-no-padding main-input" 
               label='Phone' 
               type='number'
               inputmode='numeric'
               labelPlacement="floating" 
               placeholder='Enter phone number'
               {...register('phone')}
           >
           </IonInput>
       </IonItem>
       <ErrorMessage
           errors={errors}
           name={'phone'}
           as={<div style={{ color: 'red' }} />}
       />
   </>
   <div style={{display: 'flex', justifyContent: 'flex-end'}}>
    <IonButton type='button' fill="clear" color={'dark'} size='small' className='send-otp-btn' onClick={onSendOtp} disabled={otpLoading}> 
     {otpLoading ? (
      <IonSpinner name="dots" color="dark"></IonSpinner>
     ) : (
      "Send OTP"
     )}
    </IonButton>
   </div>
   <>
       <IonItem className={`ion-no-padding auth-input-item`}>
           <IonInput 
               className="ion-no-padding main-input" 
               label='OTP' 
               type='number'
               inputmode='numeric'
               labelPlacement="floating" 
               placeholder='Enter OTP'
               {...register('otp')}
           >
           </IonInput>
       </IonItem>
       <ErrorMessage
           errors={errors}
           name={'otp'}
           as={<div style={{ color: 'red' }} />}
       />
   </>
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
     "Login"
    )}
   </IonButton>
  </div>
 </form>
}
export default LoginWithPhone