import { IonButton, IonCheckbox, IonImg, IonLabel, IonLoading, IonModal, IonSpinner, IonText } from '@ionic/react';
import './CheckoutModal.css';
import { useState } from 'react';
import { useSWRConfig } from 'swr';
import { api_routes } from '../../helper/routes';
import { useHistory } from 'react-router';
import { useToast } from '../../hooks/useToast';
import { useAxiosPrivate } from '../../hooks/useAxiosPrivate';
import { BackgroundColor, InAppBrowser } from '@capgo/inappbrowser'

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedBillingAddressData: number;
    selectedBillingInformationData: number;
}

const CheckoutModal: React.FC<Props> = ({isOpen, setIsOpen, selectedBillingAddressData, selectedBillingInformationData}) => {
    const axiosPrivate = useAxiosPrivate();
    const { toastSuccess, toastError} = useToast();
    const history = useHistory();
    const { mutate } = useSWRConfig();
    const [loading, setLoading] = useState<boolean>(false);
    const [verifyLoading, setVerifyLoading] = useState<boolean>(false);
    const [acceptTerms, setAcceptTerms] = useState<boolean>(true);
    const [includeGst, setIncludeGst] = useState<boolean>(false);
    const [modeOfPayment, setModeOfPayment] = useState<string>('Online - PayU');

    const placeOrderHandler = async (data: any) => {
        if(selectedBillingAddressData===0){
          toastError('please select / add an address');
          return;
        }
        if(selectedBillingInformationData===0){
          toastError('please select / add an billing information');
          return;
        }
        if(!acceptTerms){
          toastError('please accept the terms & condition');
          return;
        }
        
        setLoading(true);
        try {
          const response = await axiosPrivate.post(api_routes.place_order, {
            billing_address_id: selectedBillingAddressData, 
            billing_information_id: selectedBillingInformationData, 
            order_mode: 'APP', 
            mode_of_payment: modeOfPayment, 
            accept_terms: acceptTerms ? 1 : 0, 
            include_gst: includeGst ? 1 : 0
          });
          if(modeOfPayment==='Cash On Delivery'){
            toastSuccess(response.data.message);
            setIsOpen(false)
            mutate(api_routes.cart_all)
            history.push(`/order/${response.data?.order?.id}`);
          }else if(modeOfPayment==='Online - Phonepe'){
            makePayment(response.data?.order?.payment?.phone_pe_payment_link, response.data?.order?.id)
          }else if(modeOfPayment==='Online - Razorpay'){
            makePayment(response.data?.order?.payment?.razorpay_payment_link, response.data?.order?.id)
          }else if(modeOfPayment==='Online - PayU'){
            makePayment(response.data?.order?.payment?.payu_payment_link, response.data?.order?.id)
          }else if(modeOfPayment==='Online - CashFree'){
            makePayment(response.data?.order?.payment?.cashfree_payment_link, response.data?.order?.id)
          }
        } catch (error: any) {
          if (error?.response?.data?.message) {
            toastError(error?.response?.data?.message);
          }
        } finally {
          setLoading(false);
        }
    };

    const makePayment = async(url:string, order_id:string) =>{
        await InAppBrowser.openWebView({
            url: url,
            title: 'Make Payment',
            backgroundColor: BackgroundColor.WHITE,
            disableGoBackOnNativeApplication: true,
            closeModal: true,
            closeModalTitle: 'Cancel Payment',
            closeModalDescription: 'Are you sure you want to cancel payment?',
        });
        InAppBrowser.addListener('urlChangeEvent', async (state)=>{
            if (state.url.includes('closeAppBrowser=true')) {
                await InAppBrowser.close();
            }
        })
        InAppBrowser.addListener('closeEvent', async ()=>{
          try {
            setVerifyLoading(true);
            const response = await axiosPrivate.get(api_routes.place_order_detail+`/${order_id}`);
            if(response.data.order.payment.status==='PAID'){
                toastSuccess('Order placed successfully.');
                setIsOpen(false)
                mutate(api_routes.cart_all)
                history.push(`/order/${response.data?.order?.id}`);
            }
          } catch (error) {
              console.log(error);
          }finally{
            setVerifyLoading(false);
            InAppBrowser.removeAllListeners();
          }
        });
    }

    return (
        <IonModal isOpen={isOpen} onDidDismiss={()=>setIsOpen(false)} id={`checkout-main-modal`} className="post-price-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
            <div className='mt-1 mb-2'>
                <div className='page-padding billing-info-section'>
                    <IonText>
                        <h5 className='billing-info-cart-heading'>Payment Option</h5>
                        <p className='billing-info-cart-text'><code>Pick a payment option</code></p>
                    </IonText>
                </div>
                <div className='page-padding checkout-modal billing-info-section'>
                    <div className={modeOfPayment==='Online - PayU' ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>setModeOfPayment('Online - PayU')}>
                        <IonImg
                            src='/images/payu.webp'
                            alt="Sliders"
                            className='billing-info-section-card-img'
                        ></IonImg>
                        <IonLabel className='billing-info-section-card-text'>
                            <h6>Pay Online - PayU</h6>
                        </IonLabel>
                    </div>
                    {/* <div className={modeOfPayment==='Online - CashFree' ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>setModeOfPayment('Online - CashFree')}>
                        <IonImg
                            src='/images/cashfree.webp'
                            alt="Sliders"
                            className='billing-info-section-card-img'
                        ></IonImg>
                        <IonLabel className='billing-info-section-card-text'>
                            <h6>Pay Online - CashFree</h6>
                        </IonLabel>
                    </div>
                    <div className={modeOfPayment==='Online - Phonepe' ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>setModeOfPayment('Online - Phonepe')}>
                        <IonImg
                            src='/images/phonepe.webp'
                            alt="Sliders"
                            className='billing-info-section-card-img'
                        ></IonImg>
                        <IonLabel className='billing-info-section-card-text'>
                            <h6>Pay Online - Phonepe</h6>
                        </IonLabel>
                    </div>
                    <div className={modeOfPayment==='Online - Razorpay' ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>setModeOfPayment('Online - Razorpay')}>
                        <IonImg
                            src='/images/razorpay.webp'
                            alt="Sliders"
                            className='billing-info-section-card-img'
                        ></IonImg>
                        <IonLabel className='billing-info-section-card-text'>
                            <h6>Pay Online - Razorpay</h6>
                        </IonLabel>
                    </div> */}
                    <div className={modeOfPayment==='Cash On Delivery' ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>setModeOfPayment('Cash On Delivery')}>
                        <IonImg
                            src='/images/money.webp'
                            alt="Sliders"
                            className='billing-info-section-card-img'
                        ></IonImg>
                        <IonLabel className='billing-info-section-card-text'>
                            <h6>Cash On Delivery</h6>
                        </IonLabel>
                    </div>
                </div>
                <div className='page-padding billing-info-section'>
                    <div>
                        <IonCheckbox labelPlacement="end" color='dark' checked={includeGst} onIonChange={()=>setIncludeGst(prev => !prev)}>Use GST Invoice.</IonCheckbox>
                    </div>
                    <div>
                        <IonCheckbox className='mt-1' color='dark' labelPlacement="end" checked={acceptTerms} onIonChange={()=>setAcceptTerms(prev => !prev)}>I agree to your Terms and Conditions.</IonCheckbox>
                    </div>
                </div>
                <div className='text-center'>
                    <IonButton className="cart-btn" mode='md' fill='solid' color="dark" disabled={loading} onClick={placeOrderHandler}>
                        {
                            loading ? <IonSpinner name='dots' color='light' /> : 
                            'Place Order'
                        }
                    </IonButton>
                </div>
            </div>
            <IonLoading isOpen={verifyLoading} message="Verifying Payment..." spinner="crescent" />
        </IonModal>
    );
};

export default CheckoutModal;
