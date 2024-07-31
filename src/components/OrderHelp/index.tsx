import { useState } from 'react';
import '../BillingAddressEdit/BillingAddressEdit.css';
import * as yup from "yup";
import { useToast } from '../../hooks/useToast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IonButton, IonItem, IonList, IonSpinner, IonText, IonTextarea } from '@ionic/react';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { api_routes } from '../../helper/routes';
import { ErrorMessage } from '@hookform/error-message';

type Props = {
    id: number;
    showModal: React.Dispatch<React.SetStateAction<boolean>>
}

const schema = yup
  .object({
    message: yup.string().required(),
  })
  .required();

const OrderHelp:React.FC<Props> = (props) => {
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
    });

    const onSubmit = async () => {
        setLoading(true);
        try {
          await axiosPrivate.post(api_routes.place_order_enquiry + `/${props.id}`, {...getValues(), is_active:true});
          toastSuccess("Thank you for contacting us. Our team will get back to you soon.");
          reset({
            message: "",
          });
          props.showModal(false);
        } catch (error: any) {
          if (error?.response?.data?.message) {
            toastError(error?.response?.data?.message);
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

    return <div className='address-create-card mb-2'>
        <div className="product-detail-page-main-bulk-factor">
            <div className="page-padding cart-total-price-heading cart-total-price-heading-2 mb-0">
                <h6>Support For Order#{props.id}</h6>
            </div>
        </div>
        <div className="page-padding mt-1">
          <div className='billing-info-section'>
              <IonText>
                  <p className='billing-info-cart-text'><code>Please describe your query related to the order:</code></p>
              </IonText>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
              <IonList className="ion-no-padding">
                  <>
                      <IonItem className="ion-no-padding">
                          <IonTextarea
                              className="ion-no-padding main-input"
                              labelPlacement="floating"
                              placeholder='Enter your message'
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
        </div>
    </div>
}

export default OrderHelp;