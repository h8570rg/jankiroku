import {
  ToastContainer as _ToastContainer,
  toast as toastify,
  TypeOptions,
  Slide,
} from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

function _toast(type: TypeOptions) {
  return function (message: string) {
    return toastify(message, { type });
  };
}

export function toast() {
  return _toast("default");
}

toast.info = _toast("info");
toast.success = _toast("success");
toast.error = _toast("error");

export function ToastContainer() {
  return (
    <_ToastContainer
      position="bottom-center"
      hideProgressBar={true}
      draggable={false}
      closeButton={false}
      transition={Slide}
      theme="colored"
    />
  );
}
