import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Form } from "../../components/ui/form";
import FormInput from "../../components/reusables/form-input";
import useModalContext from "../../hooks/useModalContext";
import { ModalType } from "../../types/modal.types";
import { addonSchema, TAddonType } from "../../schemas/addon";
import { useEditAddonMutation } from "../../api/mutations/addons.mutation";

export default function EditAddon({
  initiatorName,
  data,
}: ModalType<"EDIT_ADDON">) {
  const { closeModal } = useModalContext();
  const form = useForm<TAddonType>({
    resolver: zodResolver(addonSchema),
    mode: "onChange",
    values: {
      name: data?.name || "",
      price: data?.price || 0,
    },
  });
  const { mutate,isLoading } = useEditAddonMutation({
    initiatorName: initiatorName || "",
  });
  const onSubmit = (data: TAddonType) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        closeModal("EDIT_ADDON");
      },
    });
  };

  return (
    <div>
      <p className="font-semibold">Edit Addon</p>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 mt-3"
          >
            <FormInput
              label="Addon Name"
              form={form}
              name="name"
              type="text"
              placeholder="Addon"
              required
            />

            <FormInput
              label="Price"
              form={form}
              name="price"
              type="number"
              placeholder="0.00"
              required
            />
            <div className="flex justify-end gap-3">
              <Button
                variant={"outline"}
                className="w-full mt-4"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button
                className="w-full mt-4"
                disabled={!form.formState.isDirty || !form.formState.isValid || isLoading}
              >
                Edit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
