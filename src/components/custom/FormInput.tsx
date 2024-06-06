import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Control } from "react-hook-form"
import { Input } from "../ui/input"

type FormInputProps = {
    control: Control<any>,
    label?: string,
    name: string,
    placeholder?: string,
    type?: 'text' | 'date' | 'number' | 'file'
    disabled?: boolean
    readOnly?:boolean
}
export const FormInput = (props: FormInputProps) => {
    return (
        <FormField
            control={props.control}
            name={props.name}
            render={({ field }) => (
                <FormItem>
                    {props.label && <FormLabel>{props.label}</FormLabel>}
                    <Input 
                        disabled={props?.disabled || false}  
                        readOnly={props?.readOnly || false}  
                        {...field} 
                        type={props.type || 'text'}
                    />
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}