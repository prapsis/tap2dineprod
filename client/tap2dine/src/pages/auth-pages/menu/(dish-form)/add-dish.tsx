import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useState } from "react";
import { useAddDishMutation } from "../../../../api/mutations/dish.mutation";
import { useFetchIngredients } from "../../../../api/queries/ingredients.query";
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
import { Link, useNavigate } from "react-router";
import { ChevronLeft, Plus, Trash } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import { useFetchCategories } from "../../../../api/queries/category.query";
import { useFetchAddons } from "../../../../api/queries/addons.query";
import { 
  Card, 
  CardContent 
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Checkbox } from "../../../../components/ui/checkbox";


export default function AddDish() {
  const navigate = useNavigate();
  const { data: ingredientsData } = useFetchIngredients();
  const { data: addonsData } = useFetchAddons();
  const { data: categories } = useFetchCategories();
  
  // Initialize form with the correct structure
  const form = useForm<TDishType>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      ingredients: [],
      add_ons: [],
      category: "",
    },
    mode: "onChange",
  });
  
  // Setup field array for ingredients
  const { fields, append, remove } = useFieldArray({
    name: "ingredients",
    control: form.control,
  });
  
  // State for selected addons
  const [selectedAddons, setSelectedAddons] = useState<number[]>([]);

  const { mutate } = useAddDishMutation();
  
  const onSubmit = (data: TDishType) => {

    mutate(data, {
      onSuccess: () => {
        form.reset();
        setSelectedAddons([]);
        navigate("/menu");
      },
    });
  };
  
  // Handle addon selection
  const handleAddonChange = (addonId: number, checked: boolean) => {
    if (checked) {
      setSelectedAddons(prev => [...prev, addonId]);
      form.setValue("add_ons", [...selectedAddons, addonId]);
    } else {
      const filtered = selectedAddons.filter(id => id !== addonId);
      setSelectedAddons(filtered);
      form.setValue("add_ons", filtered);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4">
        <Link to="/menu">
          <ChevronLeft className="text-primary border rounded-md" />
        </Link>
        <PageHeader title="Add Dish" />
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
              
              {/* Ingredients Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ingredients</Label>
                
                <div className="space-y-3">
                  {fields.map((field, index) => (
                    <Card key={field.id} className="p-2">
                      <CardContent className="flex items-center gap-3 p-2">
                        <div className="flex-1">
                          <Label htmlFor={`ingredients.${index}.ingredient`}>Ingredient</Label>
                          <Controller
                            control={form.control}
                            name={`ingredients.${index}.ingredient`}
                            render={({ field: controllerField }) => (
                              <Select
                                onValueChange={controllerField.onChange}
                                value={controllerField.value?.toString() || ""}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select ingredient" />
                                </SelectTrigger>
                                <SelectContent>
                                  {ingredientsData?.map((ingredient: TIngredientResponseType) => (
                                    <SelectItem
                                      key={ingredient.id}
                                      value={ingredient.id.toString()}
                                    >
                                      {ingredient.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        
                        <div className="flex-1">
                          <Label htmlFor={`ingredients.${index}.quantity_required`}>Quantity(In gm/ml)</Label>
                          <Input
                            id={`ingredients.${index}.quantity_required`}
                            type="number"
                            {...form.register(`ingredients.${index}.quantity_required` as const, { 
                              valueAsNumber: true,
                              min: 1
                            })}
                            placeholder="Quantity"
                          />
                        </div>
                        
                        <Button 
                          type="button" 
                          variant="destructive" 
                          size="icon"
                          onClick={() => remove(index)}
                          className="mt-5"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ ingredient:"", quantity_required: 0 })}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                </Button>
              </div>
              
              {/* Add-ons Section */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Add-ons</Label>
                <div className="grid grid-cols-2 gap-2">
                  {addonsData?.map((addon: TAddonResopnseType) => (
                    <div key={addon.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`addon-${addon.id}`}
                        checked={selectedAddons.includes(Number(addon.id))}
                        onCheckedChange={(checked) => 
                          handleAddonChange(Number(addon.id), checked as boolean)
                        }
                      />
                      <Label htmlFor={`addon-${addon.id}`}>
                        {addon.name} (Rs.{addon.price})
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end gap-3">
                <Button
                  variant={"outline"}
                  className="w-full mt-4"
                  onClick={() => {
                    form.reset();
                    setSelectedAddons([]);
                  }}
                >
                  Reset
                </Button>
                <Button className="w-full mt-4" type="submit" disabled={!form.formState.isValid}>
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