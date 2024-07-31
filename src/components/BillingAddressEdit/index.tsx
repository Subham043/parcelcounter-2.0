import { useEffect, useState } from 'react';
import './BillingAddressEdit.css';
import * as yup from "yup";
import { useToast } from '../../hooks/useToast';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { IonButton, IonIcon, IonItem, IonList, IonSpinner, IonText, IonTextarea } from '@ionic/react';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { api_routes } from '../../helper/routes';
import Input from '../Input';
import { ErrorMessage } from '@hookform/error-message';
import { KeyedMutator } from 'swr';
import { BillingAddressType, MapAddressResponse, OlaAddres } from '../../helper/types';
import OlaMap from '../Map/OlaMap';
import { close, locationOutline } from 'ionicons/icons';
// import Map from '../Map';

type Props = ({
    isEdit: true;
    data: BillingAddressType;
} | {
    isEdit: false;
}) & {
    showModal: React.Dispatch<React.SetStateAction<boolean>>
    mutate: KeyedMutator<BillingAddressType[]>
}

const fields = [
    {
        placeholder:"Enter your country",
        label:"Country",
        type:"text",
        name:"country",
        inputmode:"text"
    },{
        placeholder:"Enter your state",
        label:"State",
        type:"text",
        name:"state",
        inputmode:"text",
    },{
        placeholder:"Enter your city",
        label:"City",
        type:"text",
        name:"city",
        inputmode:"text"
    },{
        placeholder:"Enter your pin",
        label:"Pin",
        type:"text",
        name:"pin",
        inputmode:"numeric"
    }
]

const schema = yup
  .object({
    country: yup.string().required(),
    state: yup.string().required(),
    city: yup.string().required(),
    address: yup.string().required(),
    pin: yup
        .string()
        .required(),
  })
  .required();

const BillingAddressEdit:React.FC<Props> = (props) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [displayMap, setDisplayMap] = useState<boolean>(true);
    const axiosPrivate = useAxiosPrivate();
    const {toastSuccess, toastError} = useToast();
    const [currentLocation, setCurrentLocation] = useState<undefined | {lat:number, lng:number}>();
    const [mapAddress, setMapAddress] = useState<undefined | OlaAddres>();

    const {
        handleSubmit,
        setValue,
        register,
        getValues,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        values: props.isEdit ? {
          country: props.data.country,
          state: props.data.state,
          city:  props.data.city,
          pin:  props.data.pin.toString(),
          address: props.data.address,
        } : {
          country: '',
          state: '',
          city:  '',
          pin:  '',
          address:  '',
        }
    });

    useEffect(()=>{
        if(props.isEdit && props.data.map_information){
          setDisplayMap(false);
          setMapAddress(props.data.map_information ??  undefined)
        }

    }, [props.isEdit && props.data])

    const onSubmit = async () => {
        setLoading(true);
        try {
          await axiosPrivate.post(!props.isEdit ? api_routes.billing_address_create : api_routes.billing_address_update+`/${props.isEdit===true ? props.data.id : ''}`, {...getValues(), is_active:true, map_information:mapAddress});
          toastSuccess("Delivery Address created successfully.");
          reset({
            country: "",
            state: "",
            city: "",
            address: "",
            pin: "",
          });
          props.mutate()
          props.showModal(false);
        } catch (error: any) {
          if (error?.response?.data?.message) {
            toastError(error?.response?.data?.message);
          }
          if (error?.response?.data?.errors?.country) {
            setError("country", {
              type: "server",
              message: error?.response?.data?.errors?.country[0],
            });
          }
          if (error?.response?.data?.errors?.state) {
            setError("state", {
              type: "server",
              message: error?.response?.data?.errors?.state[0],
            });
          }
          if (error?.response?.data?.errors?.city) {
            setError("city", {
              type: "server",
              message: error?.response?.data?.errors?.city[0],
            });
          }
          if (error?.response?.data?.errors?.address) {
            setError("address", {
              type: "server",
              message: error?.response?.data?.errors?.address[0],
            });
          }
          if (error?.response?.data?.errors?.pin) {
            setError("pin", {
              type: "server",
              message: error?.response?.data?.errors?.pin[0],
            });
          }
        } finally {
          setLoading(false);
        }
    };

    return <div className='address-create-card mb-2'>
        <div className="product-detail-page-main-bulk-factor billing-address-edit-modal-2">
            <div className="page-padding cart-total-price-heading cart-total-price-heading-2 mb-0">
                <h6>Delivery Address</h6>
            </div>
            <IonButton color="light" fill="clear" onClick={() => props.showModal(false)}>
              <IonIcon icon={close} slot="icon-only" />
            </IonButton>
        </div>
        {/* <Map currentLocation={currentLocation} setCurrentLocation={setCurrentLocation} markerLocation={markerLocation} setMarkerLocation={setMarkerLocation} mapAddress={mapAddress} setMapAddress={setMapAddress} isEdit={props.isEdit} /> */}
        {
          displayMap ? 
          <OlaMap currentLocation={currentLocation} setCurrentLocation={setCurrentLocation} mapAddress={mapAddress} setMapAddress={setMapAddress} isEdit={props.isEdit} setConfirm={setDisplayMap} /> : 
          <div className="page-padding mt-1">
            {mapAddress && <div className="delivery-address-card">
              <div className='delivery-address-header'>
                <h6><IonIcon icon={locationOutline} className='svg-icon' /> <span>Selected Location</span></h6>
                <div className="delivery-select">
                  <button onClick={() => setDisplayMap(true)}>Change</button>
                </div>
              </div>
              <div className="delivery-detail">
                <p style={{ padding: '5px', paddingTop: '0px' }}>{mapAddress.description}</p>
              </div>
            </div>}
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
                <IonList className="ion-no-padding">
                    <>
                        <IonItem className="ion-no-padding">
                            <IonTextarea
                                className="ion-no-padding main-input"
                                labelPlacement="floating"
                                placeholder='Enter your address'
                                label='Address'
                                inputmode="text"
                                {...register('address')}
                            >
                            </IonTextarea>
                        </IonItem>
                        <ErrorMessage
                            errors={errors}
                            name='address'
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
        }
    </div>
}

export default BillingAddressEdit;