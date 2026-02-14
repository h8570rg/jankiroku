import {
  Form as HeroUiForm,
  type FormProps as HeroUiFormProps,
} from "@heroui/react";
import { type FormEvent, startTransition } from "react";

export type FormProps = Omit<
  HeroUiFormProps,
  "validationBehavior" | "onSubmit"
>;

export function Form({ children, action: formAction, ...props }: FormProps) {
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() =>
      typeof formAction === "function" ? formAction(formData) : undefined,
    );
  };
  return (
    <HeroUiForm onSubmit={handleSubmit} validationBehavior="aria" {...props}>
      {children}
    </HeroUiForm>
  );
}
