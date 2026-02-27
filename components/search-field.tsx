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
  required?: boolean;
};

export function SearchField({
  label,
  description,
  placeholder,
  required,
  ...props
}: SearchFieldProps) {
  return (
    <HeroUiSearchField isRequired={required} {...props}>
      <Label>{label}</Label>
      <HeroUiSearchField.Group>
        <HeroUiSearchField.SearchIcon />
        <HeroUiSearchField.Input placeholder={placeholder} />
        <HeroUiSearchField.ClearButton />
      </HeroUiSearchField.Group>
      <Description>{description}</Description>
      <FieldError />
    </HeroUiSearchField>
  );
}
