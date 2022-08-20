import IconMui, { IconProps as IconMuiProps } from "@mui/material/Icon";

const NAME_ENUM = {
  back: "arrow_back_ios_new",
} as const;

type Name = keyof typeof NAME_ENUM;

type Props = {
  name: Name;
} & IconMuiProps;

const Icon = ({ name, ...iconMuiProps }: Props) => {
  return <IconMui {...iconMuiProps}>{NAME_ENUM[name]}</IconMui>;
};

export default Icon;
