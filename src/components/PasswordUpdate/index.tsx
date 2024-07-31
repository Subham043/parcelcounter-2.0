import {
    IonButton,
    IonList,
    IonSpinner,
} from "@ionic/react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";
import { useAxiosPrivate } from "../../hooks/useAxiosPrivate";
import { api_routes } from "../../helper/routes";
import CommonHeading from "../CommonHeading";
import Input from "../Input";

const fields = [
  {
    placeholder: "Enter old password",
    label: "Old Password",
    type: "password",
    name: "old_password",
    inputmode: "text",
  },
  {
    placeholder: "Enter password",
    label: "Password",
    type: "password",
    name: "password",
    inputmode: "text",
  },
  {
    placeholder: "Enter confirm password",
    label: "Confirm Password",
    type: "password",
    name: "confirm_password",
    inputmode: "text",
  },
];

const schema = yup
  .object({
    old_password: yup.string().required(),
    password: yup.string().required(),
    confirm_password: yup
      .string()
      .required()
      .oneOf([yup.ref("password")], "Passwords must match"),
  })
  .required();

const PasswordUpdate: React.FC = () => {

    const [loading, setLoading] = useState(false);
    const {toastSuccess, toastError} = useToast();
    const axiosPrivate = useAxiosPrivate();

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

      const onSubmit = async (data: any) => {
        setLoading(true);
        try {
          await axiosPrivate.post(api_routes.password_update, getValues());
          toastSuccess('Password updated seccessfully.');
          reset({
            old_password: "",
            password: "",
            confirm_password: "",
          });
        } catch (error: any) {
          console.log(error);
          if (error?.response?.data?.message) {
            toastError(error?.response?.data?.message);
          }
          if (error?.response?.data?.errors?.old_password) {
            setError("old_password", {
              type: "server",
              message: error?.response?.data?.errors?.old_password[0],
            });
          }
          if (error?.response?.data?.errors?.password) {
            setError("password", {
              type: "server",
              message: error?.response?.data?.errors?.password[0],
            });
          }
          if (error?.response?.data?.errors?.confirm_password) {
            setError("confirm_password", {
              type: "server",
              message: error?.response?.data?.errors?.confirm_password[0],
            });
          }
        } finally {
          setLoading(false);
        }
      };


    return (
        <>
          <CommonHeading text="Password Update" />
          <div className="page-padding section-container pb-1">
            <form onSubmit={handleSubmit(onSubmit)}>
                <IonList className="ion-no-padding">
                {fields.map((item, i) => (
                    <Input
                        {...item}
                        register={register}
                        errors={errors}
                        key={i}
                    />
                ))}
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
                            "Reset"
                        )}
                    </IonButton>
                </div>
            </form>
          </div>
        </>
    );
};

export default PasswordUpdate;
