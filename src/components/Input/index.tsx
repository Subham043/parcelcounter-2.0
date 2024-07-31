import { ErrorMessage } from "@hookform/error-message";
import { IonButton, IonIcon, IonInput, IonItem } from "@ionic/react";
import { eyeOffOutline, eyeOutline } from "ionicons/icons";
import { useState } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import './Input.css';

type Props = {
    errors : FieldErrors<any>,
    register: UseFormRegister<any>,
    inputmode: any,
    label: string,
    type: any,
    name: any,
    placeholder: string,
    isAuth?: boolean,
};

const Input: React.FC<Props> = ({errors, register, label, type, name, placeholder, inputmode, isAuth=false}) => {
    const [passwordType, setPasswordType] = useState<boolean>(true);
    if(type==='password'){
        return (
            <>
                <IonItem className={`ion-no-padding ${isAuth ? 'auth-input-item' : ''}`}>
                    <IonInput 
                        className="ion-no-padding main-input" 
                        label={label} 
                        type={passwordType ? 'password':'text'}
                        inputmode={inputmode}
                        labelPlacement="floating" 
                        placeholder={placeholder}
                        {...register(name)}
                    >
                    </IonInput>
                    <IonButton className="input-eye-button" fill='clear' color="dark" onClick={()=>setPasswordType(prevType => !prevType)}>
                        <IonIcon icon={passwordType ? eyeOutline : eyeOffOutline}></IonIcon>
                    </IonButton>
                </IonItem>
                <ErrorMessage
                    errors={errors}
                    name={name}
                    as={<div style={{ color: 'red' }} />}
                />
            </>
        );
    }
    
    return (
        <>
            <IonItem className={`ion-no-padding ${isAuth ? 'auth-input-item' : ''}`}>
                <IonInput 
                    className="ion-no-padding main-input" 
                    label={label} 
                    type={type}
                    inputmode={inputmode}
                    labelPlacement="floating" 
                    placeholder={placeholder}
                    {...register(name)}
                >
                </IonInput>
            </IonItem>
            <ErrorMessage
                errors={errors}
                name={name}
                as={<div style={{ color: 'red' }} />}
            />
        </>
    );
}

export default Input;