import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Form } from "../../components/ui/form";
import FormInput from "../../components/reusables/form-input";
import useModalContext from "../../hooks/useModalContext";
import { ingredientSchema, TIngredientType } from "../../schemas/ingredient";
import { useEditIngredientMutation } from "../../api/mutations/ingredients.mutation";
import { ModalType } from "../../types/modal.types";

export default function EditIngredient({
  initiatorName,
  data,
}: ModalType<"EDIT_INGREDIENT">) {
  const { closeModal } = useModalContext();
  const form = useForm<TIngredientType>({
    resolver: zodResolver(ingredientSchema),
    mode: "onChange",
    values: {
      name: data?.name?.includes("-") ? data?.name?.split("-")[0] : data?.name || "",
      quantity_available: data?.quantity_available || 0,
      unit: data?.name?.includes("-") ? data?.name?.split("-")[1] : "",
    },
  });
  const { mutate, isLoading } = useEditIngredientMutation({
    initiatorName: initiatorName || "",
  });
  const onSubmit = (data: TIngredientType) => {
    mutate({
      name: `${data.name}-${data.unit}`,
      quantity_available: data.quantity_available,
    }, {
      onSuccess: () => {
        form.reset();
        closeModal("EDIT_INGREDIENT");
      },
    });
  };

  return (
    <div>
      <p className="font-semibold">Edit Ingredient</p>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-4 mt-3"
          >
            <FormInput
              label="Ingredient Name"
              form={form}
              name="name"
              type="text"
              placeholder="Ingredient"
              required
            />

            <div className="flex items-center gap-2">
              <FormInput
                label="Quantity"
                form={form}
                name="quantity_available"
                type="number"
                placeholder="Quantity"
                required
              />
              <FormInput
                label="Quantity Unit"
                form={form}
                name="unit"
                type="text"
                placeholder="Eg: gram, litre, piece..."
                required
              />
            </div>
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
