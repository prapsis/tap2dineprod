import { useForm } from 'react-hook-form';
import { dishSchema, TDishType } from '../../../../schemas/dish';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../../../components/ui/form';
import { Button } from '../../../../components/ui/button';
import { MultiSelect } from '../../../../components/reusables/multi-select';
import FormInput from '../../../../components/reusables/form-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select";
import { useEditDishMutation } from '../../../../api/mutations/dish.mutation';
import {
    TAddonResopnseType,
    TCategoryResopnseType,
    TDishResponseType,
    TIngredientResponseType,
} from "../../../../types/response.types";
import { useNavigate } from 'react-router';
import { useQueryClient } from "@tanstack/react-query";

type TEditDishFormProps = {
    dishId: string;
    dishData: TDishResponseType;
    categories: TCategoryResopnseType[];
    addons: TAddonResopnseType[];
    ingredients: TIngredientResponseType[];
}
export default function EditDishForm({
    dishId, dishData, categories, addons, ingredients
}: TEditDishFormProps) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const form = useForm<TDishType>({
        resolver: zodResolver(dishSchema),
        mode: "onChange",
        values: {
            name: dishData?.name || "",
            description: dishData?.description || "",
            price: dishData?.price || 0,
            ingredients: dishData.ingredients?.map((ingredient: TIngredientResponseType) =>
                ingredient.id.toString(),
            ) || [],
            add_ons: dishData.add_ons?.map((addon: TAddonResopnseType) =>
                addon.id.toString(),
            ) || [],
            category: dishData.category?.id.toString() || "",
        },
    });
    const { mutate } = useEditDishMutation({ initiatorName: dishId });

    const onSubmit = (data: TDishType) => {
        console.log("Submitting data:", data);
        mutate(data, {
            onSuccess: () => {
                navigate("/menu");
                queryClient.invalidateQueries({ queryKey: ["dishes"] });
            },
        });
    };
    return (
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
                                options={ingredients.map((ingredient: TIngredientResponseType) => ({
                                    label: ingredient.name,
                                    value: ingredient.id.toString(),
                                }))}
                                defaultValue={field.value as string[] || []}
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
                        render={(field) => {
                            console.log(field.value)
                            return(<MultiSelect
                                options={addons?.map((addon: TAddonResopnseType) => ({
                                    label: addon.name,
                                    value: addon.id.toString(),
                                })) || []}
                                defaultValue={field.value as string[] || []}
                                onValueChange={field.onChange}
                                placeholder="Select Addons"
                                variant="inverted"
                            />)
                        }}
                    />
                    <div className="flex justify-end gap-3">
                        <Button
                            variant="outline"
                            className="w-full mt-4"
                            onClick={() => form.reset()}
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
    )
}
