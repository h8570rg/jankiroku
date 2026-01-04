import { cn } from "@heroui/react";
import { SERVICE_NAME } from "@/lib/config";

function Logo({ className }: { className?: string }) {
  return <div className={cn("font-rocknroll", className)}>{SERVICE_NAME}</div>;
}

export default Logo;
