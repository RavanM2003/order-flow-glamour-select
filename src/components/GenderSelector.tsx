import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { User, Users } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface GenderSelectorProps {
  value: "male" | "female" | "";
  onChange: (value: "male" | "female") => void;
  className?: string;
}

const GenderOption = ({ selected, onClick, icon: Icon, label }) => (
  <Card
    className={cn(
      "p-4 cursor-pointer transition-all hover:shadow-md",
      selected
        ? "border-glamour-700 bg-glamour-700"
        : "border-gray-200 hover:border-glamour-300 bg-white"
    )}
    onClick={onClick}
  >
    <div className="flex flex-col items-center space-y-2">
      <div
        className={cn(
          "p-3 rounded-full transition-all",
          selected
            ? "bg-white text-glamour-700"
            : "bg-gray-100 text-glamour-700"
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <span
        className={cn(
          "text-sm font-medium transition-colors hidden md:block",
          selected ? "text-white" : "text-gray-600"
        )}
      >
        {label}
      </span>
    </div>
  </Card>
);

const GenderSelector = ({
  value,
  onChange,
  className,
}: GenderSelectorProps) => {
  const { t } = useLanguage();

  return (
    <div className={cn("space-y-4", className)}>
      <label className="text-sm font-medium text-gray-700">
        {t("booking.gender")} *
      </label>
      <div className="grid grid-cols-2 gap-4">
        <GenderOption
          selected={value === "male"}
          onClick={() => onChange("male")}
          icon={User}
          label={t("booking.male")}
        />
        <GenderOption
          selected={value === "female"}
          onClick={() => onChange("female")}
          icon={Users}
          label={t("booking.female")}
        />
      </div>
    </div>
  );
};

export default GenderSelector;
