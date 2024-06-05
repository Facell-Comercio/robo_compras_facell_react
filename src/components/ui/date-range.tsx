import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DatePickerWithRangeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  date?: DateRange;
  setDate?: (date: DateRange) => void;
  disabled?: boolean;
  description?: string;
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
  disabled,
  description,
}: DatePickerWithRangeProps) {
  // Não é necessário definir date e setDate no estado interno.
  // O código já recebe date e setDate das propriedades.

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            disabled={disabled}
            variant={"outline"}
            className={cn(
              "max-w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>{description ? description : "Selecione o período"}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            locale={ptBR}
            defaultMonth={date?.from}
            selected={date}
            // @ts-ignore
            onSelect={setDate} // Chama a função setDate recebida como parâmetro
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
