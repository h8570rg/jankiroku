import {
  Description,
  FieldError,
  TextField as HeroUiTextField,
  type TextFieldProps as HeroUiTextFieldProps,
  InputGroup,
  Label,
} from "@heroui/react";

export type TextFieldProps = Omit<HeroUiTextFieldProps, "isInvalid"> & {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: React.ReactNode;
  required?: boolean;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  classNames?: {
    input?: string;
  };
};

export function TextField({
  label,
  description,
  placeholder,
  required,
  prefix,
  suffix,
  classNames,
  ...props
}: TextFieldProps) {
  return (
    <HeroUiTextField isRequired={required} {...props}>
      <Label>{label}</Label>
      <InputGroup>
        {prefix && <InputGroup.Prefix>{prefix}</InputGroup.Prefix>}
        <InputGroup.Input
          className={classNames?.input}
          placeholder={placeholder}
        />
        {suffix && <InputGroup.Suffix>{suffix}</InputGroup.Suffix>}
      </InputGroup>
      <Description>{description}</Description>
      <FieldError>
        {(validation) => validation.validationErrors?.[0]}
      </FieldError>
    </HeroUiTextField>
  );
}
