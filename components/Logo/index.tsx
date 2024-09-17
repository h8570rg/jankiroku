import classNames from "classnames";

function Logo({ className }: { className?: string }) {
  const serviceName = process.env.NEXT_PUBLIC_SERVICE_NAME;
  return (
    <div className={classNames("font-righteous", className)}>
      {process.env.NEXT_PUBLIC_SERVICE_ENV === "development" && (
        <span className="text-warning">{`[開発環境] `}</span>
      )}
      {serviceName[0].toUpperCase() + serviceName.slice(1)}
    </div>
  );
}

export default Logo;
