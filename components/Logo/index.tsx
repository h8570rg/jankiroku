import classNames from "classnames";

function Logo({ className }: { className?: string }) {
  return (
    <div className={classNames("font-rocknroll", className)}>
      {process.env.NEXT_PUBLIC_SERVICE_ENV === "development" && (
        <span className="text-warning">{`[開発環境] `}</span>
      )}
      雀鬼禄
    </div>
  );
}

export default Logo;
