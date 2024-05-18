import { Input as NextUiInput, InputProps } from "@nextui-org/react";

export function Input(props: Omit<InputProps, "isInvalid">) {
  return <NextUiInput {...props} isInvalid={!!props.errorMessage} />;
}
