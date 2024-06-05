import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import {Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Control } from "react-hook-form"

type SelectOption = {
    value: string,
    label: string,
}
type FormSelectProps = {
    control: Control<any>,
    label?: string,
    name: string,
    placeholder?: string,
    options: SelectOption[]
}
export const FormSelect = (props: FormSelectProps) => {
    return (
        <FormField
            control={props.control}
            name={props.name}
            render={({ field }) => (
                <FormItem>
                    {props.label && <FormLabel>{props.label}</FormLabel>}
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={props.placeholder || 'SELECIONE'} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {props.options.map((option:SelectOption,index)=>(
                                <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}