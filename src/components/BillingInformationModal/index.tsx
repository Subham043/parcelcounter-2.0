import { IonIcon, IonLabel, IonModal, IonSpinner, IonText, useIonRouter } from '@ionic/react';
import './BillingInformationModal.css';
import { peopleCircleOutline } from 'ionicons/icons';
import { BillingInformationResponseType } from '../../helper/types';

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    billingInformationLoading: boolean;
    billingInformationData: undefined | BillingInformationResponseType;
    selectedBillingInformationData: number;
    setSelectedBillingInformationData: React.Dispatch<React.SetStateAction<number>>;
}

const BillingInformationModal: React.FC<Props> = ({isOpen, setIsOpen, billingInformationData, billingInformationLoading, selectedBillingInformationData, setSelectedBillingInformationData}) => {
    const router = useIonRouter();
    const addBtnHandler = () => {
        setIsOpen(false);
        router.push('/billing-information')
    }
    
    const selectionHandler = (id:number) => {
        setSelectedBillingInformationData(id)
        setIsOpen(false);
    }
    return (
        <IonModal isOpen={isOpen} onDidDismiss={()=>setIsOpen(false)} id={`checkout-main-modal`} className="post-price-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
            <div className='billing-info-modal mt-1 mb-2'>
                <div className='page-padding billing-info-section'>
                    <div className="billing-info-modal-header-row">
                        <div className="billing-info-col-auto">
                            <IonText>
                                <h5 className='billing-info-cart-heading'>Billing Information</h5>
                                <p className='billing-info-cart-text'><code>Pick a billing information</code></p>
                            </IonText>
                        </div>
                        <button onClick={addBtnHandler} className='billing-info-modal-add-btn'>ADD</button>
                    </div>
                    {
                        billingInformationLoading ? <div className='text-left mt-1 mb-1'>
                            <IonSpinner color='dark' />
                        </div>:
                        <div className='w-100'>
                            {
                                billingInformationData?.data.map((item, i) => <div className={selectedBillingInformationData===item.id ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>selectionHandler(item.id)} key={i}>
                                    <IonIcon aria-hidden="true" icon={peopleCircleOutline} className='billing-info-section-card-icon'></IonIcon>
                                    <IonLabel className='billing-info-section-card-text'>
                                        <h6>{item.name}</h6>
                                        <p>{item.email}, {item.phone} {item.gst && item.gst.length>0 ? `, ${item.gst}` : null}</p>
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

export default BillingInformationModal;
