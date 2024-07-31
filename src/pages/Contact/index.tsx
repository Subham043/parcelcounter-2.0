import {
    IonPage,
    IonContent,
    IonCard,
    IonButton,
    IonList,
    IonSpinner,
    IonCardContent,
    IonItem,
    IonIcon,
    IonLabel,
    IonTextarea,
} from "@ionic/react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import MainHeader from "../../components/MainHeader";
import { useAuth } from "../../context/AuthProvider";
import { useToast } from "../../hooks/useToast";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { api_routes } from "../../helper/routes";
import Input from "../../components/Input";
import { callOutline, mailOutline, locationOutline } from "ionicons/icons";
import './Contact.css'
import { ErrorMessage } from "@hookform/error-message";

const fields = [
    {
      placeholder: "Enter name",
      label: "Name",
      type: "text",
      name: "name",
      inputmode: "text",
    },
    {
      placeholder: "Enter email",
      label: "Email",
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
];

const schema = yup
  .object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    message: yup.string().required(),
    phone: yup
      .string()
      .required()
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
  })
  .required();

const Contact: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const {auth} = useAuth();
    const {toastSuccess, toastError} = useToast();
    const axiosPrivate = useAxiosPrivate();

    const {
        handleSubmit,
        register,
        getValues,
        reset,
        setError,
        formState: { errors },
      } = useForm({
        resolver: yupResolver(schema),
        values: {
          name: auth.user ? auth.user.name : '',
          email: auth.user ? auth.user.email : '',
          phone: auth.user ? auth.user.phone : '',
          message: '',
        }
      });
      

      const onSubmit = async () => {
        setLoading(true);
        try {
          const response = await axiosPrivate.post(api_routes.enquiry, {...getValues(), page_url: 'https://parcelcounter.in/contact'});
          toastSuccess(response.data.message);
          reset({
            'message': ''
          })
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
          if (error?.response?.data?.errors?.message) {
            setError("message", {
              type: "server",
              message: error?.response?.data?.errors?.message[0],
            });
          }
        } finally {
          setLoading(false);
        }
      };
      

    return (
        <IonPage>
            <MainHeader isMainHeader={false} name="Contact Us" />
            <IonContent fullscreen={false} forceOverscroll={false}>
                <IonCard className="mt-1">
                    <div className="product-detail-page-main-bulk-factor">
                        <div className="cart-total-price-heading cart-total-price-heading-2">
                            <h6>Contact Information</h6>
                        </div>
                    </div>
                    <IonItem lines="inset">
                        <IonIcon icon={mailOutline} slot="start" className='order-detail-billing-icon'></IonIcon>
                        <IonLabel>
                            <p className='order-detail-personal-info'>detoxfolks@gmail.com</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem lines="inset">
                        <IonIcon icon={callOutline} slot="start" className='order-detail-billing-icon'></IonIcon>
                        <IonLabel>
                            <p className='order-detail-personal-info'>9380911495</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem lines="inset">
                        <IonIcon icon={locationOutline} slot="start" className='order-detail-billing-icon'></IonIcon>
                        <IonLabel className="ion-text-wrap">
                            <p className='order-detail-personal-info'>2, OVH ROAD, BASAVANAGUDI, BENGALURU, Pin - 560004</p>
                        </IonLabel>
                    </IonItem>
                </IonCard>
                <IonCard>
                    <div className="product-detail-page-main-bulk-factor">
                        <div className="cart-total-price-heading cart-total-price-heading-2">
                            <h6>Reach Out To Us</h6>
                        </div>
                    </div>
                    <IonCardContent className="pt-0">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <IonList className="ion-no-padding">
                            {fields.map((item, i) => (
                                <Input
                                    {...item}
                                    register={register}
                                    errors={errors}
                                    key={i}
                                />
                            ))}
                            </IonList>
                            <IonList className="ion-no-padding">
                                <>
                                    <IonItem className="ion-no-padding">
                                        <IonTextarea
                                            className="ion-no-padding main-input"
                                            labelPlacement="floating"
                                            placeholder='Enter message'
                                            label='Message'
                                            inputmode="text"
                                            {...register('message')}
                                        >
                                        </IonTextarea>
                                    </IonItem>
                                    <ErrorMessage
                                        errors={errors}
                                        name='message'
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
                                        "Submit"
                                    )}
                                </IonButton>
                            </div>
                        </form>
                    </IonCardContent>
                </IonCard>
            </IonContent>
        </IonPage>
    );
};

export default Contact;
