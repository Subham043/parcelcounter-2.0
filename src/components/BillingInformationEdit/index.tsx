import { useState } from 'react';
import './BillingInformationEdit.css';
import * as yup from "yup";
import { useToast } from '../../hooks/useToast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IonButton, IonCard, IonCardContent, IonItem, IonList, IonSpinner, IonText, IonTextarea } from '@ionic/react';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { api_routes } from '../../helper/routes';
import Input from '../Input';
import { KeyedMutator } from 'swr';
import { BillingInformationType } from '../../helper/types';

type Props = ({
    isEdit: true;
    data: BillingInformationType;
} | {
    isEdit: false;
}) & {
    showModal: React.Dispatch<React.SetStateAction<boolean>>
    mutate: KeyedMutator<BillingInformationType[]>
}

const fields = [
    {
        placeholder:"Enter your name",
        label:"Name",
        type:"text",
        name:"name",
        inputmode:"text"
    },{
        placeholder:"Enter your email",
        label:"Email",
        type:"text",
        name:"email",
        inputmode:"email",
    },{
        placeholder:"Enter your phone",
        label:"Phone",
        type:"text",
        name:"phone",
        inputmode:"numeric"
    },{
      placeholder:"Enter your gst",
      label:"GST",
      type:"text",
      name:"gst",
      inputmode:"text"
    },
]

const schema = yup
  .object({
    email: yup.string().email().required(),
    name: yup.string().required(),
    phone: yup
      .string()
      .required()
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
    gst: yup
      .string(),
  })
  .required();

const BillingInformationEdit:React.FC<Props> = (props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();
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
        values: props.isEdit ? {
          name: props.data.name,
          email: props.data.email,
          gst: props.data.gst,
          phone: props.data.phone.toString(),
        } : {
          name: '',
          email: '',
          gst: '',
          phone: '',
        }
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
          await axiosPrivate.post(!props.isEdit ? api_routes.billing_information_create : api_routes.billing_information_update+`/${props.isEdit===true ? props.data.id : ''}`, {...getValues(), is_active:true});
          toastSuccess("Delivery Address created successfully.");
          reset({
            name: "",
            email: "",
            phone: "",
            gst: "",
          });
          props.mutate()
          props.showModal(false);
        } catch (error: any) {
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
          if (error?.response?.data?.errors?.gst) {
            setError("gst", {
              type: "server",
              message: error?.response?.data?.errors?.gst[0],
            });
          }
        } finally {
          setLoading(false);
        }
    };

    return <div className='address-create-card mb-2'>
        <div className="product-detail-page-main-bulk-factor">
            <div className="page-padding cart-total-price-heading cart-total-price-heading-2">
                <h6>Billing Information</h6>
            </div>
        </div>
        <div className="page-padding">
          <div className='billing-info-section'>
              <IonText>
                  <p className='billing-info-cart-text'><code>Enter the following information:</code></p>
              </IonText>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
              {
                  fields.map((item, i) => <IonList className="ion-no-padding" key={i}>
                      <Input
                          {...item}
                          register={register}
                          errors={errors}
                      />
                  </IonList>)
              }
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
                          "Save"
                      )}
                  </IonButton>
              </div>
          </form>
        </div>
    </div>
}

export default BillingInformationEdit;