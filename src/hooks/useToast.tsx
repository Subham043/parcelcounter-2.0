import { ToastOptions, toast } from "react-toastify";

const toastConfig:ToastOptions = {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
}

export function useToast(){
    const toastSuccess = (msg:string) => {toast.dismiss(); toast.success(msg, toastConfig)};
    const toastError = (msg:string) => {toast.dismiss(); toast.error(msg, toastConfig)};
    const toastInfo = (msg:string) => {toast.dismiss(); toast.info(msg, toastConfig)};
    return {
        toastSuccess,
        toastError,
        toastInfo
    };
}