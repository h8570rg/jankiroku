import {
  Description,
  FieldError,
  SearchField as HeroUiSearchField,
  type SearchFieldProps as HeroUiSearchFieldProps,
  Label,
} from "@heroui/react";

export type SearchFieldProps = Omit<HeroUiSearchFieldProps, "isInvalid"> & {
  label?: string;
  description?: string;
  placeholder?: string;
  errorMessage?: React.ReactNode;
  required?: boolean;
};

export function SearchField({
  label,
  description,
  placeholder,
  errorMessage,
  required,
  ...props
}: SearchFieldProps) {
  return (
    <HeroUiSearchField
      isInvalid={!!errorMessage}
      isRequired={required}
      {...props}
    >
      <Label>{label}</Label>
      <HeroUiSearchField.Group>
        <HeroUiSearchField.SearchIcon />
        <HeroUiSearchField.Input placeholder={placeholder} />
        <HeroUiSearchField.ClearButton />
      </HeroUiSearchField.Group>
      <Description>{description}</Description>
      <FieldError>{errorMessage}</FieldError>
    </HeroUiSearchField>
  );
}
