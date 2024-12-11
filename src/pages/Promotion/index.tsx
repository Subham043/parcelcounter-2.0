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
} from "@ionic/react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useCallback, useState } from "react";
import MainHeader from "../../components/MainHeader";
import { useAuth } from "../../context/AuthProvider";
import { useToast } from "../../hooks/useToast";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { api_routes } from "../../helper/routes";
import Input from "../../components/Input";
import { callOutline, mailOutline, peopleCircleOutline } from "ionicons/icons";
import './Promotion.css'
import { axiosPublic } from "../../../axios";
import useSWR from "swr";
import LoadingCard from "../../components/LoadingCard";

type PromotionResponseType = {
  promoted: false;
} | {
  promoted: true;
  promoter: {
    name: string;
    email: string;
    phone: string;
    id: number;
  }
}

const fields = [
    {
      placeholder: "Enter code",
      label: "Code",
      type: "text",
      name: "code",
      inputmode: "text",
    },
];

const schema = yup
  .object({
    code: yup.string().required().min(6, "Must be exactly 6 characters").max(6, "Must be exactly 6 characters"),
  })
  .required();

const Promotion: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const {auth} = useAuth();
    const {toastSuccess, toastError} = useToast();
    const axiosPrivate = useAxiosPrivate();
    const fetcher = useCallback(
      async (url: string) => {
        if(auth.authenticated){
          const headers = {
            headers: {
              "Authorization" : `Bearer ${auth.token}`,
              "Accept": 'application/json'
            }
          }
          const res =  await axiosPublic.get(url,headers)
          return res.data;
        }
        return undefined;
      },
      [auth],
    );
    const { data, isLoading, mutate } = useSWR<PromotionResponseType>(auth.authenticated ? api_routes.promotion : null, fetcher);

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
          code: '',
        }
      });
      

      const onSubmit = async () => {
        setLoading(true);
        try {
          const response = await axiosPrivate.post(api_routes.promotion, {...getValues()});
          toastSuccess(response.data.message);
          reset({
            'code': ''
          })
          mutate();
        } catch (error: any) {
          console.log(error);
          if (error?.response?.data?.message) {
            toastError(error?.response?.data?.message);
          }
          if (error?.response?.data?.errors?.code) {
            setError("code", {
              type: "server",
              message: error?.response?.data?.errors?.code[0],
            });
          }
        } finally {
          setLoading(false);
        }
      };
      

    return (
        <IonPage>
            <MainHeader isMainHeader={false} name="Promotion" />
            <IonContent fullscreen={false} forceOverscroll={false}>
                {isLoading ? <LoadingCard itemCount={1} column={12} height='170px' /> : 
                (data && data.promoted ?
                  <IonCard className="mt-1">
                    <div className="product-detail-page-main-bulk-factor">
                        <div className="cart-total-price-heading cart-total-price-heading-2">
                            <h6>Promoter Information</h6>
                        </div>
                    </div>
                    <IonItem lines="inset">
                        <IonIcon icon={peopleCircleOutline} slot="start" className='order-detail-billing-icon'></IonIcon>
                        <IonLabel>
                            <p className='order-detail-personal-info'>{data.promoter.name}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem lines="inset">
                        <IonIcon icon={mailOutline} slot="start" className='order-detail-billing-icon'></IonIcon>
                        <IonLabel>
                            <p className='order-detail-personal-info'>{data.promoter.email}</p>
                        </IonLabel>
                    </IonItem>
                    <IonItem lines="inset">
                        <IonIcon icon={callOutline} slot="start" className='order-detail-billing-icon'></IonIcon>
                        <IonLabel>
                            <p className='order-detail-personal-info'>{data.promoter.phone}</p>
                        </IonLabel>
                    </IonItem>
                </IonCard> : 
                <IonCard>
                    <div className="product-detail-page-main-bulk-factor">
                        <div className="cart-total-price-heading cart-total-price-heading-2">
                            <h6>Promoter Code</h6>
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
                )}
            </IonContent>
        </IonPage>
    );
};

export default Promotion;
