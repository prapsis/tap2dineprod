import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Form } from "../../components/ui/form";
import FormInput from "../../components/reusables/form-input";
import useModalContext from "../../hooks/useModalContext";
import { ModalType } from "../../types/modal.types";
import { useEditTableMutation } from "../../api/mutations/table.mutation";
import { tableSchema, TTableType } from "../../schemas/table";

export default function EditTable({
  initiatorName,
  data,
}: ModalType<"EDIT_TABLE">) {
  const { closeModal } = useModalContext();
  const form = useForm<TTableType>({
    resolver: zodResolver(tableSchema),
    mode: "onChange",
    values: {
      name: data?.name || "",
    },
  });
  const { mutate } = useEditTableMutation({
    initiatorName: initiatorName || "",
  });
  const onSubmit = (data: TTableType) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        closeModal("EDIT_TABLE");
      },
    });
  };

  return (
    <div>
      <p className="font-semibold">Edit Table</p>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 mt-3"
          >
            <FormInput
              label="Table Name"
              form={form}
              name="name"
              type="text"
              placeholder="Table name"
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
                disabled={!form.formState.isDirty || !form.formState.isValid}
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
