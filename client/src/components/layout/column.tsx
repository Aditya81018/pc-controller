import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export default function Column({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col w-full h-full", className)} {...props} />
  );
}
