import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEditCategoryMutation } from "../../api/mutations/category.mutation";
import { Button } from "../../components/ui/button";
import { TCategoryType, categorySchema } from "../../schemas/category";
import { Form } from "../../components/ui/form";
import FormInput from "../../components/reusables/form-input";
import useModalContext from "../../hooks/useModalContext";
import { ModalType } from "../../types/modal.types";

export default function EditCategory({
  initiatorName,
  data,
}: ModalType<"EDIT_CATEGORY">) {
  const { closeModal } = useModalContext();
  const form = useForm<TCategoryType>({
    resolver: zodResolver(categorySchema),
    mode: "onChange",
    values: {
      name: data?.name || "",
      description: data?.description,
    },
  });
  const { mutate,isLoading } = useEditCategoryMutation({
    initiatorName: initiatorName || "",
  });
  const onSubmit = (data: TCategoryType) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        closeModal("EDIT_CATEGORY");
      },
    });
  };

  return (
    <div>
      <p className="font-semibold">Edit Category</p>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 mt-3"
          >
            <FormInput
              label="Category Name"
              form={form}
              name="name"
              type="text"
              placeholder="Category"
              required
            />

            <FormInput
              label="Description"
              form={form}
              name="description"
              type="text"
              placeholder="Description"
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
