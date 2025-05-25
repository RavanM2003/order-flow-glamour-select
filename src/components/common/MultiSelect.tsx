import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  defaultValue?: string[];
  className?: string;
  disabled?: boolean;
  // Add support for both 'selected' and 'value' props
  selected?: string[];
  value?: string[];
}

const SelectPopover = ({
  options,
  selectedValues,
  handleSelectItem,
}: {
  options: MultiSelectOption[];
  selectedValues: string[];
  handleSelectItem: (value: string) => void;
}) => (
  <PopoverContent className="w-full p-0" align="start">
    <Command>
      <CommandInput placeholder="Search items..." />
      <CommandEmpty>No item found.</CommandEmpty>
      <CommandGroup className="max-h-64 overflow-auto">
        {options.map((option) => {
          const isSelected = selectedValues.includes(option.value);
          return (
            <CommandItem
              key={option.value}
              onSelect={() => handleSelectItem(option.value)}
              className="flex items-center"
            >
              <div
                className={cn(
                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  isSelected
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50"
                )}
              >
                {isSelected && <Check className="h-3 w-3" />}
              </div>
              <span>{option.label}</span>
            </CommandItem>
          );
        })}
      </CommandGroup>
    </Command>
  </PopoverContent>
);

const MultiSelect = ({
  options,
  onChange,
  placeholder = "Select items...",
  defaultValue = [],
  selected,
  value,
  className,
  disabled = false,
}: MultiSelectProps) => {
  const [open, setOpen] = useState(false);
  // Use selected or value prop if provided, falling back to defaultValue
  const [selectedValues, setSelectedValues] = useState<string[]>(
    selected || value || defaultValue
  );

  useEffect(() => {
    if (selected !== undefined) {
      setSelectedValues(selected);
    } else if (value !== undefined) {
      setSelectedValues(value);
    } else if (defaultValue) {
      setSelectedValues(defaultValue);
    }
  }, [defaultValue, selected, value]);

  const handleSelectItem = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const handleRemoveItem = (value: string) => {
    const newSelectedValues = selectedValues.filter((item) => item !== value);
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const selectedLabels = selectedValues.map((value) => {
    const option = options.find((opt) => opt.value === value);
    return option ? option.label : value;
  });

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between text-left font-normal h-auto min-h-10",
              !selectedValues.length && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            {selectedValues.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {selectedLabels.map((label) => (
                  <Badge key={label} variant="secondary" className="mr-1 mb-1">
                    {label}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemoveItem(
                            options.find((opt) => opt.label === label)?.value ||
                              ""
                          );
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() =>
                        handleRemoveItem(
                          options.find((opt) => opt.label === label)?.value ||
                            ""
                        )
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            ) : (
              placeholder
            )}
          </Button>
        </PopoverTrigger>
        <SelectPopover
          options={options}
          selectedValues={selectedValues}
          handleSelectItem={handleSelectItem}
        />
      </Popover>
    </div>
  );
};

export default MultiSelect;
