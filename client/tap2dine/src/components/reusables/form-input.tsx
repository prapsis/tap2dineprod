import { ControllerRenderProps, FieldValues, Path, UseFormReturn } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

type TFormInputProps<T extends FieldValues> = {
    label?: string;
    form: UseFormReturn<T>;
    render?: (field: ControllerRenderProps<T, Path<T>>) => React.ReactNode;
    name: Path<T>;
    type?: string;
    placeholder?: string;
    required?: boolean;
}

export default function FormInput<T extends FieldValues>({ label, form, render, name,type,placeholder,required }: TFormInputProps<T>) {
    return (
        <div>
            {
                label && <FormLabel className="text-sm">{label}{" "}{required && <span className="text-red-600 text-xs">*</span>}</FormLabel>
            }
            <FormField
                control={form.control}
                name={name}
                render={({ field, fieldState }) => (
                    <FormItem>
                        <FormControl>
                            {render ? (
                                render(field)
                            ) : (
                                <Input
                                    type={type}
                                    placeholder={placeholder}
                                    {...field}
                                />
                            )}
                        </FormControl>
                        {fieldState.error && (
                            <FormMessage className="text-[10px] mt-0">
                                {fieldState.error.message}
                            </FormMessage>
                        )}
                    </FormItem>
                )}
            />
        </div>
    )
}
