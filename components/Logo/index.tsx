import classNames from "classnames";

import { config } from "~/lib/config";

const Logo = ({ className }: { className?: string }) => {
  const serviceName = config.public.serviceName;
  if (!serviceName) {
    throw new Error("Service name env is not defined.");
  }
  return (
    <div className={classNames("font-righteous", className)}>
      {serviceName[0].toUpperCase() + serviceName.slice(1)}
    </div>
  );
};

export default Logo;
