import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import z from "zod";
import type { Area } from "@/app/dashboard/areas/_components/areas";
import { Button } from "@/components/ui/button";
import { CustomFormField } from "@/components/ui/custom-field";
import CustomSelect from "@/components/ui/custom-select";
import { Form } from "@/components/ui/form";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { fetcher } from "@/lib/fetcher";
import type { Connection } from "../../_components/columns";

const connectionUpdateSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Name should contain at least 4 characterns" })
    .trim()
    .toUpperCase(),
  phoneNumber: z
    .string()
    .min(10, { message: "Not a valid phone number" })
    .trim(),
  boxNumber: z
    .string()
    .min(10, { message: "Smartcard should be at least 10 characters long" })
    .trim()
    .toUpperCase(),
  area: z.nanoid({ message: "Required field" }),
});

interface Props {
  connection: Connection;
  open: boolean;
  onOpenChange: (state: boolean) => void;
  callback: (data: z.infer<typeof connectionUpdateSchema>, area: Area) => void;
}

export type ConnectionUpdateSchema = z.infer<typeof connectionUpdateSchema>;

export default function UpdateConnection({
  connection,
  open,
  onOpenChange,
  callback,
}: Props) {
  const form = useForm<z.infer<typeof connectionUpdateSchema>>({
    resolver: zodResolver(connectionUpdateSchema),
    defaultValues: {
      ...connection,
      area: connection.area.id,
    },
  });
  const isMobile = useIsMobile();
  const { data: areas } = useSWR<Area[]>("/api/area", fetcher);

  const save = async (data: z.infer<typeof connectionUpdateSchema>) => {
    const res = await fetch("/api/connection", {
      method: "PUT",
      body: JSON.stringify({ id: connection.id, ...data }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      const selectedArea = areas?.find((area) => area.id === data.area);
      // @ts-expect-error
      callback(data, selectedArea);
    } else if (res.status !== 500 && res.status !== 200) {
      const errors = (await res.json()) as { [key: string]: string };
      for (const field in errors) {
        // @ts-expect-error
        form.setError(field, { message: [errors[field]] });
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={isMobile ? "bottom" : "right"}>
        <form onSubmit={form.handleSubmit(save)}>
          <SheetHeader>
            <SheetTitle>Update connection</SheetTitle>
            <SheetDescription>Modify connection details</SheetDescription>
          </SheetHeader>
          <Form {...form}>
            <div className="space-y-4 px-4">
              <CustomFormField
                control={form.control}
                name="name"
                label="Name"
                placeholder="John Shelby"
                required
              />
              <CustomFormField
                control={form.control}
                name="boxNumber"
                label="Smartcard"
                placeholder="83060001AE86"
                required
              />
              <CustomFormField
                control={form.control}
                name="phoneNumber"
                label="Phone"
                placeholder="+91-9874343433"
                type="tel"
              />
              <CustomSelect
                control={form.control}
                name="area"
                label="Area"
                placeHolder="Select an area"
                // @ts-expect-error
                items={areas}
                required
              />
            </div>
          </Form>
          <SheetFooter>
            <SheetClose asChild>
              <Button variant="destructive">Cancel</Button>
            </SheetClose>
            <Button type="submit">Save</Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
