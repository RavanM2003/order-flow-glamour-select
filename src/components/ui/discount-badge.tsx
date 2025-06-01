
import { memo } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context";

interface DiscountBadgeProps {
  discount: number;
  className?: string;
}

const DiscountBadge = ({ discount, className }: DiscountBadgeProps) => {
  const { t } = useLanguage();

  if (!discount || discount <= 0) return null;

  return (
    <div
      className={cn(
        "absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg border-2 border-white",
        className
      )}
    >
      -{discount}%
    </div>
  );
};

export default memo(DiscountBadge);
