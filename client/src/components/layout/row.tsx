import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export default function Row({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex w-full", className)} {...props} />;
}
