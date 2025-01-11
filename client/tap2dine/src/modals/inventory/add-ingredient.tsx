import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import { Form } from "../../components/ui/form";
import FormInput from "../../components/reusables/form-input";
import useModalContext from "../../hooks/useModalContext";
import { ingredientSchema, TIngredientType } from "../../schemas/ingredient";
import { useAddIngredientMutation } from "../../api/mutations/ingredients.mutation";

export default function AddIngredient() {
  const { closeModal } = useModalContext();
  const form = useForm<TIngredientType>({
    resolver: zodResolver(ingredientSchema),
    mode: "onChange",
    values: {
      name: "",
      quantity_available: 0,
    },
  });
  const { mutate } = useAddIngredientMutation();
  const onSubmit = (data: TIngredientType) => {
    mutate(data, {
      onSuccess: () => {
        form.reset();
        closeModal("ADD_INGREDIENT");
      },
    });
  };

  return (
    <div>
      <p className="font-semibold">Add Ingredient</p>
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

            <FormInput
              label="Quantity"
              form={form}
              name="quantity_available"
              type="number"
              placeholder="Quantity"
            />
            <div className="flex justify-end gap-3">
              <Button
                variant={"outline"}
                className="w-full mt-4"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button className="w-full mt-4">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
