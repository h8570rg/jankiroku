import {
  cn,
  FieldError,
  Select as HeroUiSelect,
  type SelectProps as HeroUiSelectProps,
  Label,
  ListBox,
} from "@heroui/react";

type SelectProps = {
  label?: string;
  items: {
    key: string;
    label: string;
  }[];
  labelPlacement?: "inside" | "outside";
} & Omit<HeroUiSelectProps<{ value: string }>, "items">;

export function Select({
  label,
  items,
  labelPlacement = "inside",
  className,
  ...props
}: SelectProps) {
  return (
    <HeroUiSelect
      className={cn(
        {
          "flex-row items-center gap-2": labelPlacement === "outside",
        },
        className,
      )}
      {...props}
    >
      <Label>{label}</Label>
      <HeroUiSelect.Trigger
        className={cn({
          grow: labelPlacement === "outside",
        })}
      >
        <HeroUiSelect.Value />
        <HeroUiSelect.Indicator />
      </HeroUiSelect.Trigger>
      <HeroUiSelect.Popover>
        <ListBox>
          {items.map((item) => (
            <ListBox.Item key={item.key} id={item.key} textValue={item.label}>
              {item.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </HeroUiSelect.Popover>
      <FieldError />
    </HeroUiSelect>
  );
}
