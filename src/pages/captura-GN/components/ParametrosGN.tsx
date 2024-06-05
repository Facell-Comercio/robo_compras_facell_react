import { FormInput } from "@/components/custom/FormInput"
import { FormSelect } from "@/components/custom/FormSelect"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { zodResolver } from "@hookform/resolvers/zod"
import { formatDate, subDays } from "date-fns"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const ParametrosGN = () => {
    const state = useStoreCapturaGN().state;
    const setState = useStoreCapturaGN().setState;


    const formSchema = z.object({
        grupo_economico: z.string(),
        exibir_janela: z.string(),
        token: z.string(),
        rsa: z.string().min(6, 'RSA precisa ter 6 caracteres'),
        data_inicial: z.coerce.date(),
        data_final: z.coerce.date(),
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        values: {
            grupo_economico: '1',
            exibir_janela: '0',
            token: localStorage.getItem('tokenTIM'),
            rsa: '',
            data_inicial: formatDate(subDays(new Date(), 30), 'yyyy-MM-dd'),
            data_final: formatDate(new Date(), 'yyyy-MM-dd'),
        },
        defaultValues: {
            grupo_economico: '1',
            exibir_janela: '0',
            token: localStorage.getItem('tokenTIM'),
            rsa: '',
            data_inicial: formatDate(subDays(new Date(), 30), 'yyyy-MM-dd'),
            data_final: formatDate(new Date(), 'yyyy-MM-dd'),
        }
    })

    const onSubmit = () => {
        setState('running')
    }

    const handleClickParar = ()=>{
        setState('initial')
    }

    const btnIniciarDisabled = !(state == 'initial');
    const btnPararDisabled = !(state == 'running');

    return (
        <Card>
            <CardHeader>
                <CardTitle>Parâmetros GN</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-3">

                            <div className="flex gap-3">
                                <FormSelect
                                    control={form.control}
                                    label="Grupo econômico"
                                    name="grupo_economico"
                                    options={[
                                        { value: '1', label: 'FACELL' },
                                        { value: '9', label: 'FORTTELECOM' },
                                    ]}
                                />

                                <FormSelect
                                    control={form.control}
                                    label="Exibir janela"
                                    name="exibir_janela"
                                    options={[
                                        { value: '1', label: 'SIM' },
                                        { value: '0', label: 'NÃO' },
                                    ]}
                                />
                            </div>

                            <div className="flex gap-3">
                                <FormInput
                                    control={form.control}
                                    label="Data Inicial"
                                    name="data_inicial"
                                    type="date"
                                />
                                <FormInput
                                    control={form.control}
                                    label="Data Final"
                                    name="data_final"
                                    type="date"
                                />
                            </div>

                            <div className="flex gap-3">
                                <FormInput
                                    control={form.control}
                                    label="Token"
                                    name="token"
                                    placeholder="T900000"
                                />
                                <FormInput
                                    control={form.control}
                                    label="RSA"
                                    name="rsa"
                                    placeholder="000000"
                                />
                            </div>


                            <Button disabled={btnIniciarDisabled} type="submit">Iniciar</Button>
                            <Button onClick={handleClickParar} disabled={btnPararDisabled} type="button" variant={'destructive'}>Parar</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
            <CardFooter>
            </CardFooter>
        </Card>
    )
}