import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export default function Page({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col min-h-svh w-screen gap-4", className)}
      {...props}
    />
  );
}
