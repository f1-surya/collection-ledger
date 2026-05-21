import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

type CustomSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  control: Control<TFieldValues>;
  name: TName;
  label: string;
  placeHolder: string;
  required?: boolean;
  items: { id: string; name: string }[];
};

export default function CustomSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  placeHolder,
  required,
  items,
}: CustomSelectProps<TFieldValues, TName>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedItem = items.find((item) => item.id === field.value);
        const filteredItems = items.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        );

        return (
          <FormItem>
            <FormLabel>
              {label}
              {required && "*"}:
            </FormLabel>
            <Popover
              open={open}
              onOpenChange={(nextOpen) => {
                setOpen(nextOpen);
                if (!nextOpen) {
                  setSearch("");
                }
              }}
            >
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    type="button"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground",
                      fieldState.error &&
                        "text-destructive border-destructive dark:border-destructive",
                    )}
                  >
                    {selectedItem?.name ?? placeHolder}
                    <ChevronsUpDown />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-2">
                <div className="space-y-2">
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={`Search ${label.toLowerCase()}`}
                    className="h-9"
                  />
                  <div
                    className="h-[min(15rem,var(--radix-popover-content-available-height))] overflow-y-auto overscroll-contain pr-1"
                    onWheelCapture={(event) => event.stopPropagation()}
                  >
                    {filteredItems.length === 0 ? (
                      <p className="text-muted-foreground px-2 py-3 text-sm">
                        No results found
                      </p>
                    ) : (
                      filteredItems.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className={cn(
                            "hover:bg-accent hover:text-accent-foreground flex w-full items-center rounded-sm px-2 py-2 text-left text-sm outline-none transition-colors",
                            item.id === field.value && "bg-accent",
                          )}
                          onClick={() => {
                            field.onChange(item.id);
                            setOpen(false);
                            setSearch("");
                          }}
                        >
                          <span className="truncate">{item.name}</span>
                          <Check
                            className={cn(
                              "ml-auto",
                              item.id === field.value
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
