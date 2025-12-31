import classNames from "classnames";
import { SERVICE_NAME } from "@/lib/config";

function Logo({ className }: { className?: string }) {
  return (
    <div className={classNames("font-rocknroll", className)}>
      {SERVICE_NAME}
    </div>
  );
}

export default Logo;
