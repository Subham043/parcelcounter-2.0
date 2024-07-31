import { IonIcon, IonLabel, IonModal, IonSpinner, IonText, useIonRouter } from '@ionic/react';
import './BillingAddressModal.css';
import { locationOutline } from 'ionicons/icons';
import { BillingAddressResponseType } from '../../helper/types';

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    billingAddressLoading: boolean;
    billingAddressData: undefined | BillingAddressResponseType;
    selectedBillingAddressData: number;
    setSelectedBillingAddressData: React.Dispatch<React.SetStateAction<number>>;
}

const BillingAddressModal: React.FC<Props> = ({isOpen, setIsOpen, billingAddressData, billingAddressLoading, selectedBillingAddressData, setSelectedBillingAddressData}) => {
    const router = useIonRouter();
    const addBtnHandler = () => {
        setIsOpen(false);
        router.push('/billing-address')
    }
    const selectionHandler: (id:number)=>void = (id:number) => {
        setSelectedBillingAddressData(id)
        setIsOpen(false);
    }

    return (
        <IonModal isOpen={isOpen} onDidDismiss={()=>setIsOpen(false)} id={`checkout-main-modal`} className="post-price-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
            <div className='billing-info-modal mt-1 mb-2'>
                <div className='page-padding billing-info-section'>
                    <div className="billing-info-modal-header-row">
                        <div className="billing-info-col-auto">
                            <IonText>
                                <h5 className='billing-info-cart-heading'>Delivery Address</h5>
                                <p className='billing-info-cart-text'><code>Pick a delivery address</code></p>
                            </IonText>
                        </div>
                        <button onClick={addBtnHandler} className='billing-info-modal-add-btn'>ADD</button>
                    </div>
                    {
                        billingAddressLoading ? <div className='text-left mt-1 mb-1'>
                            <IonSpinner color='dark' />
                        </div>
                        :
                        <div className='w-100'>
                            {
                                billingAddressData?.data.map((item, i) => <div className={selectedBillingAddressData===item.id ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>selectionHandler(item.id)} key={i}>
                                    <IonIcon aria-hidden="true" icon={locationOutline} className='billing-info-section-card-icon'></IonIcon>
                                    <IonLabel className='billing-info-section-card-text'>
                                        <h6>{item.country}</h6>
                                        <p>
                                            {item.address}, {item.city}, {item.state} - {item.pin}, {item.country}
                                        </p>
                                    </IonLabel>
                                </div>)
                            }
                        </div>
                    }
                </div>
            </div>
        </IonModal>
    );
};

export default BillingAddressModal;
