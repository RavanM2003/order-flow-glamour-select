import { useLanguage } from "@/context";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface GenderSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const GenderSelector = ({ value, onChange }: GenderSelectorProps) => {
  const { t } = useLanguage();

  return (
    <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="male" id="male" />
        <Label htmlFor="male">{t("common.male")}</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="female" id="female" />
        <Label htmlFor="female">{t("common.female")}</Label>
      </div>
    </RadioGroup>
  );
};

export default GenderSelector;
