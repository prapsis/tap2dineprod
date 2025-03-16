import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import { useEditDishMutation } from "../../../../api/mutations/dish.mutation";
import { Button } from "../../../../components/ui/button";
import { TDishType, dishSchema } from "../../../../schemas/dish";
import {
    TAddonResopnseType,
    TCategoryResopnseType,
    TIngredientResponseType,
    TDishResponseType,
} from "../../../../types/response.types";
import FormInput from "../../../../components/reusables/form-input";
import { Form } from "../../../../components/ui/form";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../../components/ui/select";
import { Card, CardContent } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "../../../../components/ui/label";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Trash, Plus } from "lucide-react";

type TEditDishFormProps = {
    dishId: string;
    dishData: TDishResponseType;
    categories: TCategoryResopnseType[];
    addons: TAddonResopnseType[];
    ingredients: TIngredientResponseType[];
};

export default function EditDishForm({ dishId, dishData, categories, addons, ingredients }: TEditDishFormProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const form = useForm<TDishType>({
        resolver: zodResolver(dishSchema),
        defaultValues: {
            name: dishData.name || "",
            description: dishData.description || "",
            price: dishData.price || 0,
            ingredients: dishData.dish_ingredients?.map(i => ({ ingredient: i.ingredient.id.toString(), quantity_required: i.quantity_required })) || [],
            add_ons: dishData.add_ons?.map(a => Number(a.id)) || [],
            category: dishData.category?.id.toString() || "",
        },
        mode: "onChange",
    });

    const { fields, append, remove } = useFieldArray({ name: "ingredients", control: form.control });
    const [selectedAddons, setSelectedAddons] = useState<number[]>(form.getValues("add_ons") || []);

    const { mutate } = useEditDishMutation({ initiatorName: dishId });

    const onSubmit = (data: TDishType) => {
        mutate(data, {
            onSuccess: () => {
                navigate("/menu");
                queryClient.invalidateQueries({ queryKey: ["dishes"] });
            },
        });
    };

    return (
        <div className="w-full max-w-2xl border rounded-md p-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormInput label="Dish Name" form={form} name="name" type="text" placeholder="Dish" required />
                    <FormInput label="Description" form={form} name="description" type="text" placeholder="Description.." />
                    <FormInput label="Price" form={form} name="price" type="number" placeholder="0.00" required />

                    <FormInput label="Category" form={form} name="category" render={(field) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                            <SelectTrigger className="w-full"><SelectValue placeholder="Select a category" /></SelectTrigger>
                            <SelectContent>
                                {categories.map(category => <SelectItem key={category.id} value={category.id.toString()}>{category.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    )} required />

                    <Label>Ingredients</Label>
                    {fields.map((field, index) => (
                        <Card key={field.id} className="p-2">
                            <CardContent className="flex items-center gap-3 p-2">
                                <Select onValueChange={(value) => form.setValue(`ingredients.${index}.ingredient`, value)} value={field.ingredient}>
                                    <SelectTrigger><SelectValue placeholder="Select ingredient" /></SelectTrigger>
                                    <SelectContent>
                                        {ingredients.map(ingredient => <SelectItem key={ingredient.id} value={ingredient.id.toString()}>{ingredient.name.includes("-") ? `${ingredient.name.split("-")[0]} (in ${ingredient.name.split("-")[1]})` : ingredient.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                <Input type="number" {...form.register(`ingredients.${index}.quantity_required`, { valueAsNumber: true })} placeholder="Quantity" />
                                <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}><Trash className="h-4 w-4" /></Button>
                            </CardContent>
                        </Card>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => append({ ingredient: "", quantity_required: 1 })}><Plus className="h-4 w-4 mr-2" /> Add Ingredient</Button>
                    <div>
                    <Label className="pb-2">Add-ons</Label>
                    <div className="grid grid-cols-2 gap-2">
                        {addons.map(addon => (
                            <div key={addon.id} className="flex items-center space-x-2">
                                <Checkbox id={`addon-${addon.id}`} checked={selectedAddons.includes(Number(addon.id))} onCheckedChange={checked => setSelectedAddons(prev => checked ? [...prev, Number(addon.id)] : prev.filter(id => id !== Number(addon.id)))} />
                                <Label htmlFor={`addon-${addon.id}`}>{addon.name} (${addon.price})</Label>
                            </div>
                        ))}
                    </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <Button variant="outline" className="w-full mt-4" onClick={() => form.reset()}>Reset</Button>
                        <Button className="w-full mt-4" type="submit" disabled={!form.formState.isValid}>Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

