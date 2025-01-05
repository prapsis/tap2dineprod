import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddCategoryMutation } from "../../api/mutations/category.mutation";
import { Button } from "../../components/ui/button";
import { TCategoryType, categorySchema } from "../../schemas/category";
import { Form } from "../../components/ui/form";
import FormInput from "../../components/reusables/form-input";
import useModalContext from "../../hooks/useModalContext";

export default function AddCategory() {
    const { closeModal } = useModalContext();
    const form = useForm<TCategoryType>({
        resolver: zodResolver(categorySchema),
        mode: "onChange",
        values: {
            name: "",
            description: ""
        }
    });
    const { mutate } = useAddCategoryMutation();
    const onSubmit = (data: TCategoryType) => {
        mutate(data, {
            onSuccess: () => {
                form.reset();
                closeModal('ADD_CATEGORY');
            }
        })
    }

    return (
        <div>
            <p className='font-semibold'>Add Category</p>
            <div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 mt-3">
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
                        <div className='flex justify-end gap-3'>
                            <Button variant={"outline"} className="w-full mt-4" onClick={() => form.reset()}>Reset</Button>
                            <Button className="w-full mt-4">Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}