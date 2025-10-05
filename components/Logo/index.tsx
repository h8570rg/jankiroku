import classNames from "classnames";
import { SERVICE_NAME } from "@/lib/config";

function Logo({ className }: { className?: string }) {
	return (
		<div className={classNames("font-rocknroll", className)}>
			{process.env.NEXT_PUBLIC_SERVICE_ENV === "development" && (
				<span className="text-warning">{`[開発環境] `}</span>
			)}
			{SERVICE_NAME}
		</div>
	);
}

export default Logo;
