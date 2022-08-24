import Typography, { TypographyProps } from "@mui/material/Typography";

const Logo = (props: Omit<TypographyProps<"div">, "component">) => {
  return (
    <Typography {...props} component="div">
      Janreco
    </Typography>
  );
};

export default Logo;
