import { IonIcon, IonLabel, IonModal, IonSpinner, IonText } from '@ionic/react';
import './DeliverySlotNewModal.css';
import { timeOutline } from 'ionicons/icons';
import { DeliverySlotNewResponseType } from '../../helper/types';

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    deliverySlotNewLoading: boolean;
    deliverySlotNewData: undefined | DeliverySlotNewResponseType;
    selectedDeliverySlotNewData: string|undefined;
    setSelectedDeliverySlotNewData: React.Dispatch<React.SetStateAction<string|undefined>>;
    setIsCODAllowed: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeliverySlotNewModal: React.FC<Props> = ({isOpen, setIsOpen, deliverySlotNewData, deliverySlotNewLoading, selectedDeliverySlotNewData, setSelectedDeliverySlotNewData, setIsCODAllowed}) => {
    
    const selectionHandler = ({name, is_cod_allowed}:{name:string, is_cod_allowed:boolean}) => {
        setSelectedDeliverySlotNewData(name)
        setIsCODAllowed(is_cod_allowed)
        setIsOpen(false);
    }
    return (
        <IonModal isOpen={isOpen} onDidDismiss={()=>setIsOpen(false)} id={`checkout-main-modal`} className="post-price-modal" initialBreakpoint={1} breakpoints={[0, 1]}>
            <div className='billing-info-modal mt-1 mb-2'>
                <div className='page-padding billing-info-section'>
                    <div className="billing-info-modal-header-row">
                        <div className="billing-info-col-auto">
                            <IonText>
                                <h5 className='billing-info-cart-heading'>Delivery Slot</h5>
                                <p className='billing-info-cart-text'><code>Pick a delivery slot</code></p>
                            </IonText>
                        </div>
                    </div>
                    {
                        deliverySlotNewLoading ? <div className='text-left mt-1 mb-1'>
                            <IonSpinner color='dark' />
                        </div>:
                        <div className='w-100'>
                            {
                                deliverySlotNewData?.delivery_slot.map((item, i) => <div className={selectedDeliverySlotNewData===item.name ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>selectionHandler({name: item.name, is_cod_allowed: item.is_cod_allowed})} key={i}>
                                    <IonIcon aria-hidden="true" icon={timeOutline} className='billing-info-section-card-icon'></IonIcon>
                                    <IonLabel className='billing-info-section-card-text'>
                                        <h6>{item.name}</h6>
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

export default DeliverySlotNewModal;
