import { IonButton, IonList, IonSpinner } from '@ionic/react';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Input from '../Input';
import { axiosPublic } from '../../../axios';
import { api_routes } from '../../helper/routes';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../context/AuthProvider';
import { useSWRConfig } from 'swr';

const schema = yup
 .object({
  phone: yup
        .string()
        .required()
        .min(10, "Must be exactly 10 digits")
        .max(10, "Must be exactly 10 digits"),
  password: yup.string().required(),
 })
 .required();

const fields = [
 {
  placeholder: "Enter phone number",
  label: "Phone",
  type: "number",
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
];

const LoginWithPhonePassword: React.FC = () => {
 const [loading, setLoading] = useState<boolean>(false);
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
   const response = await axiosPublic.post(api_routes.login_phone_password, getValues());
   toastSuccess('Logged in seccessfully.');
   reset({
    phone: "",
    password: "",
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
   if (error?.response?.data?.errors?.password) {
    setError("password", {
     type: "server",
     message: error?.response?.data?.errors?.password[0],
    });
   }
  } finally {
   setLoading(false);
  }
 };

 return <form onSubmit={handleSubmit(onSubmit)}>
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
     "Login"
    )}
   </IonButton>
  </div>
 </form>
}
export default LoginWithPhonePassword