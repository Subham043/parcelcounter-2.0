import { useState } from 'react';
import './ProductReviewModal.css';
import * as yup from "yup";
import { useToast } from '../../hooks/useToast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IonButton, IonIcon, IonItem, IonList, IonModal, IonSpinner, IonText, IonTextarea } from '@ionic/react';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { api_routes } from '../../helper/routes';
import { KeyedMutator } from 'swr';
import { ProductReviewResponseType } from '../../helper/types';
import { ErrorMessage } from '@hookform/error-message';
import { star, starOutline } from 'ionicons/icons';

type Props = {
    slug: string;
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>
    mutate: KeyedMutator<ProductReviewResponseType>
}

const schema = yup
  .object({
    rating: yup
      .number()
      .required()
      .min(1, "Must be exactly 1 digits")
      .max(5, "Must be exactly 5 digits"),
    comment: yup
      .string().optional(),
  })
  .required();

const ProductReviewModal:React.FC<Props> = (props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const axiosPrivate = useAxiosPrivate();
    const {toastSuccess, toastError} = useToast();

    const {
        handleSubmit,
        register,
        getValues,
        reset,
        setError,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        values: {
          rating: 5,
          comment: "",
        }
    });

    const rating = watch('rating');

    const onSubmit = async () => {
        setLoading(true);
        try {
          await axiosPrivate.post(api_routes.products+`/${props.slug}/reviews/create`, {...getValues(), is_active:true});
          toastSuccess("Review created successfully.");
          reset({
            rating: 5,
            comment: "",
          });
          props.mutate()
          props.setShowModal(false);
        } catch (error: any) {
          if (error?.response?.data?.message) {
            toastError(error?.response?.data?.message);
          }
          if (error?.response?.data?.errors?.rating) {
            setError("rating", {
              type: "server",
              message: error?.response?.data?.errors?.rating[0],
            });
          }
          if (error?.response?.data?.errors?.comment) {
            setError("comment", {
              type: "server",
              message: error?.response?.data?.errors?.comment[0],
            });
          }
        } finally {
          setLoading(false);
        }
    };

    return <IonModal isOpen={props.showModal} onDidDismiss={()=>{props.setShowModal(false); setValue('rating', 5);}} id={`checkout-main-modal`} className="post-price-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
        <div className='address-create-card mb-2'>
            <div className="product-detail-page-main-bulk-factor">
                <div className="page-padding cart-total-price-heading cart-total-price-heading-2">
                    <h6>Product Review</h6>
                </div>
            </div>
            <div className="page-padding">
            <div className='billing-info-section'>
                <IonText>
                    <p className='billing-info-cart-text'><code>Enter the following information:</code></p>
                </IonText>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <IonList className="ion-no-padding">
                    <div className='rating-container-modal mt-1'>
                        {
                            [1, 2, 3, 4, 5].map((item, index) => {
                                return <div key={index}>
                                    <IonIcon
                                        icon={item <= rating ? star : starOutline}
                                        color={item <= rating ? "warning" : "medium"}
                                        size="large"
                                        onClick={() => setValue('rating', item)}
                                    />
                                </div>
                            })
                        }
                    </div>
                </IonList>
                <IonList className="ion-no-padding">
                    <>
                        <IonItem className="ion-no-padding">
                            <IonTextarea
                                className="ion-no-padding main-input"
                                labelPlacement="floating"
                                placeholder='Enter comment'
                                label='Comment'
                                inputmode="text"
                                {...register('comment')}
                            >
                            </IonTextarea>
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name='comment'
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
                            "Save"
                        )}
                    </IonButton>
                </div>
            </form>
            </div>
        </div>
    </IonModal>
}

export default ProductReviewModal;