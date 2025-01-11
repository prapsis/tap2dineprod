import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Form } from "../../components/ui/form";
import FormInput from "../../components/reusables/form-input";
import useModalContext from "../../hooks/useModalContext";
import { tableSchema, TTableType } from "../../schemas/table";
import { useAddTableMutation } from "../../api/mutations/table.mutation";

export default function AddTable() {
  const { closeModal } = useModalContext();
  const form = useForm<TTableType>({
    resolver: zodResolver(tableSchema),
    mode: "onChange",
    values: {
      name: "",
    },
  });
  const { mutate } = useAddTableMutation();
  const onSubmit = (data: TTableType) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        closeModal("ADD_TABLE");
      },
    });
  };

  return (
    <div>
      <p className="font-semibold">Add Table</p>
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
              placeholder="Table Name"
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
                disabled={!form.formState.isValid}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
