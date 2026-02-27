import {
  Form as HeroUiForm,
  type FormProps as HeroUiFormProps,
} from "@heroui/react";

export type FormProps = Omit<HeroUiFormProps, "validationBehavior">;

export function Form({ children, action: formAction, ...props }: FormProps) {
  return (
    <HeroUiForm validationBehavior="aria" {...props}>
      {children}
    </HeroUiForm>
  );
}
