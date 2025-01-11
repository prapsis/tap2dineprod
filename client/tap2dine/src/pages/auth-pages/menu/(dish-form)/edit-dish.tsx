import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useEditDishMutation } from "../../../../api/mutations/dish.mutation";
import { useFetchIngredients } from "../../../../api/queries/ingredients.query";
import { MultiSelect } from "../../../../components/reusables/multi-select";
import { Button } from "../../../../components/ui/button";
import { TDishType, dishSchema } from "../../../../schemas/dish";
import {
  TAddonResopnseType,
  TCategoryResopnseType,
  TIngredientResponseType,
} from "../../../../types/response.types";
import FormInput from "../../../../components/reusables/form-input";
import { Form } from "../../../../components/ui/form";
import PageHeader from "../../../../components/reusables/page-header";
import { Link, useNavigate, useParams } from "react-router";
import { ChevronLeft, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useFetchCategories } from "../../../../api/queries/category.query";
import { useFetchAddons } from "../../../../api/queries/addons.query";
import { useFetchSingleDish } from "../../../../api/queries/dish.query";

export default function EditDish() {
  const { id: dishId } = useParams();
  const navigate = useNavigate();

  const { data: dishData, isLoading: isDishLoading } = useFetchSingleDish({
    queryParams: dishId!,
  });
  const { data: ingredientsData, isLoading: isIngredientsLoading } =
    useFetchIngredients();
  const { data: addonsData, isLoading: isAddonsLoading } = useFetchAddons();
  const { data: categories, isLoading: isCategoriesLoading } =
    useFetchCategories();

  const [ingredients, setIngredients] = useState<
    {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[]
  >([]);
  const [addons, setAddons] = useState<
    {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[]
  >([]);

  const isLoading =
    isDishLoading ||
    isIngredientsLoading ||
    isAddonsLoading ||
    isCategoriesLoading;

  const form = useForm<TDishType>({
    resolver: zodResolver(dishSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      ingredients: [],
      add_ons: [],
      category: "",
    },
  });

  // Update form values when dish data is loaded
  useEffect(() => {
    if (dishData) {
      const initialIngredients =
        dishData.ingredients?.map((ingredient: TIngredientResponseType) =>
          ingredient.id.toString(),
        ) || [];

      const initialAddons =
        dishData.add_ons?.map((addon: TAddonResopnseType) =>
          addon.id.toString(),
        ) || [];

      form.reset({
        name: dishData.name,
        description: dishData.description,
        price: dishData.price,
        ingredients: initialIngredients,
        add_ons: initialAddons,
        category: dishData.category?.id.toString(),
      });
    }
  }, [dishData, form.reset]);

  useEffect(() => {
    if (ingredientsData) {
      setIngredients(
        ingredientsData.map((ingredient: TIngredientResponseType) => ({
          label: ingredient.name,
          value: ingredient.id.toString(),
        })),
      );
    }
  }, [ingredientsData]);

  useEffect(() => {
    if (addonsData) {
      setAddons(
        addonsData.map((addon: TAddonResopnseType) => ({
          label: addon.name,
          value: addon.id.toString(),
        })),
      );
    }
  }, [addonsData]);

  const { mutate } = useEditDishMutation({ initiatorName: dishId! });

  const onSubmit = (data: TDishType) => {
    console.log("Submitting data:", data);
    mutate(data, {
      onSuccess: () => {
        navigate("/menu");
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-full h-[50vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Loading dish details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <Link to="/menu">
          <ChevronLeft className="text-primary border rounded-md" />
        </Link>
        <PageHeader title="Edit Dish" />
      </div>
      <div className="max-w-2xl border rounded-md p-4">
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full space-y-4 mt-3"
            >
              <FormInput
                label="Dish Name"
                form={form}
                name="name"
                type="text"
                placeholder="Dish"
                required
              />

              <FormInput
                label="Description"
                form={form}
                name="description"
                type="text"
                placeholder="Description.."
              />
              <FormInput
                label="Price"
                form={form}
                name="price"
                type="number"
                placeholder="0.00"
                required
              />
              <FormInput
                label="Category"
                form={form}
                name="category"
                render={(field) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value?.toString()}
                    value={field.value?.toString()}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((category: TCategoryResopnseType) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                required
              />
              <FormInput
                label="Select Ingredients"
                form={form}
                name="ingredients"
                render={(field) => (
                  <MultiSelect
                    options={ingredients}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select Ingredients"
                    variant="inverted"
                  />
                )}
              />
              <FormInput
                label="Select Addons"
                form={form}
                name="add_ons"
                render={(field) => (
                  <MultiSelect
                    options={addons}
                    value={field.value}
                    onValueChange={field.onChange}
                    placeholder="Select Addons"
                    variant="inverted"
                  />
                )}
              />
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  onClick={() => {
                    // Reset to initial dish data instead of empty values
                    if (dishData) {
                      form.reset({
                        name: dishData.name,
                        description: dishData.description,
                        price: dishData.price,
                        ingredients:
                          dishData.ingredients?.map((i) => i.id.toString()) ||
                          [],
                        add_ons:
                          dishData.add_ons?.map((a) => a.id.toString()) || [],
                        category: dishData.category?.id.toString(),
                      });
                    }
                  }}
                >
                  Reset
                </Button>
                <Button className="w-full mt-4" type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
