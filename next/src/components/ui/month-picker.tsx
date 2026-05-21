import { format } from "date-fns";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

export function MonthPicker({
  value,
  onChange,
  min,
  max,
}: {
  value: Date;
  onChange: (v: Date) => void;
  min?: Date;
  max?: Date;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary" size="sm">
          {format(value, "MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newDate = new Date(value);
                newDate.setFullYear(value.getFullYear() - 1);
                if (!min || newDate >= min) {
                  onChange(newDate);
                }
              }}
              disabled={min && value.getFullYear() <= min.getFullYear()}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            <span className="font-medium">{value.getFullYear()}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newDate = new Date(value);
                newDate.setFullYear(value.getFullYear() + 1);
                if (!max || newDate <= max) {
                  onChange(newDate);
                }
              }}
              disabled={max && value.getFullYear() >= max.getFullYear()}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {months.map((month, index) => {
              const monthDate = new Date(value.getFullYear(), index, 1);
              const isDisabled =
                (min && monthDate < min) || (max && monthDate > max);
              const isSelected = value.getMonth() === index;
              return (
                <Button
                  key={month}
                  variant={isSelected ? "default" : "ghost"}
                  size="sm"
                  onClick={() => {
                    const newDate = new Date(value);
                    newDate.setMonth(index);
                    onChange(newDate);
                  }}
                  disabled={isDisabled}
                  className="w-full"
                >
                  {month}
                </Button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
