import { IonIcon, IonLabel, IonModal, IonText } from '@ionic/react';
import './DeliverySlotModal.css';
import { timeOutline } from 'ionicons/icons';

type Props = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    selectedDeliverySlotData: 'Morning: 9:00 AM - 11:00 AM'|'Evening: 6:00 PM - 8:00 PM'|'Afternoon: 2:00 PM - 4:00 PM';
    setSelectedDeliverySlotData: React.Dispatch<React.SetStateAction<'Morning: 9:00 AM - 11:00 AM'|'Evening: 6:00 PM - 8:00 PM'|'Afternoon: 2:00 PM - 4:00 PM'>>;
}

const deliverySlotData: ('Morning: 9:00 AM - 11:00 AM'|'Evening: 6:00 PM - 8:00 PM'|'Afternoon: 2:00 PM - 4:00 PM')[] = [
    'Morning: 9:00 AM - 11:00 AM',
    'Afternoon: 2:00 PM - 4:00 PM',
    'Evening: 6:00 PM - 8:00 PM',
]

const DeliverySlotModal: React.FC<Props> = ({isOpen, setIsOpen, selectedDeliverySlotData, setSelectedDeliverySlotData}) => {
    
    const selectionHandler: (data:'Morning: 9:00 AM - 11:00 AM'|'Evening: 6:00 PM - 8:00 PM'|'Afternoon: 2:00 PM - 4:00 PM')=>void = (data:'Morning: 9:00 AM - 11:00 AM'|'Evening: 6:00 PM - 8:00 PM'|'Afternoon: 2:00 PM - 4:00 PM') => {
        setSelectedDeliverySlotData(data)
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
                    <div className='w-100'>
                        {
                            deliverySlotData.map((item, i) => <div className={selectedDeliverySlotData===item ? 'billing-info-section-card-active' : 'billing-info-section-card'} onClick={()=>selectionHandler(item)} key={i}>
                                <IonIcon aria-hidden="true" icon={timeOutline} className='billing-info-section-card-icon'></IonIcon>
                                <IonLabel className='billing-info-section-card-text'>
                                    <h6>{item}</h6>
                                </IonLabel>
                            </div>)
                        }
                    </div>
                </div>
            </div>
        </IonModal>
    );
};

export default DeliverySlotModal;