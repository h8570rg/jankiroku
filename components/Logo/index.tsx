import classNames from "classnames";

function Logo({ className }: { className?: string }) {
  const serviceName = process.env.NEXT_PUBLIC_SERVICE_NAME;
  return (
    <div className={classNames("font-righteous", className)}>
      {serviceName[0].toUpperCase() + serviceName.slice(1)}
    </div>
  );
}

export default Logo;
