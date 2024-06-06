import { getFiliais } from "@/api/filiais"
import { FormInput } from "@/components/custom/FormInput"
import { FormSelect } from "@/components/custom/FormSelect"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { toast } from "@/components/ui/use-toast"
import { useStoreCapturaGN } from "@/context/captura-gn-store"
import { Filial } from "@/types/filial-type"
import { zodResolver } from "@hookform/resolvers/zod"
import { formatDate, subDays } from "date-fns"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

export const ParametrosGN = () => {
    const state = useStoreCapturaGN().state;
    const setState = useStoreCapturaGN().setState;
    const updateGnFilial = useStoreCapturaGN().updateGnFilial;

    const formSchema = z.object({
        id_grupo_economico: z.string(),
        exibir_janela: z.string(),
        token: z.string(),
        rsa: z.string().min(6, 'RSA precisa ter 6 caracteres'),
        data_inicial: z.coerce.date(),
        data_final: z.coerce.date(),
    })
    const form = useForm({
        resolver: zodResolver(formSchema),
        values: {
            id_grupo_economico: '1',
            exibir_janela: localStorage.getItem('exibirJanelaGN') || '0',
            token: localStorage.getItem('tokenTIM') || '',
            rsa: '',
            data_inicial: formatDate(subDays(new Date(), 30), 'yyyy-MM-dd'),
            data_final: formatDate(new Date(), 'yyyy-MM-dd'),
        },
    })

    const id_grupo_economico = form.watch('id_grupo_economico')

    // @ts-ignore
    const onSubmit = (data) => {
        console.log('onSubmit')
        const { token, exibir_janela } = data;
        if(state.filiais.length === 0){
            toast({
                variant: 'destructive', title: 'Erro!', description: 'Não foi possível buscar as filiais, altere o grupo econônomico e tente novamente...'
            })
            return
        }
        const initialData = {
            ...data,
            exibir_janela: exibir_janela == '0' ? false : true,
            filiais: state.filiais,
        }

        localStorage.setItem('tokenTIM', token)
        localStorage.setItem('exibirJanelaGN', exibir_janela)

        window.ipcRenderer.send('CAPTURA-GN-INIT', initialData)
        setState({ status: 'running' })
    }

    const handleClickParar = () => {
        setState({ status: 'initial' })
    }

    async function fetchFiliais() {
        try {
            const result = await getFiliais({ filters: { id_grupo_economico, tim_cod_sap: 'all' } })
            const filiais = result?.data?.rows || []
            setState({
                filiais: filiais.map((f: Filial) => ({
                    ...f,
                    pedidos: 0,
                    faturados: 0,
                    notas_fiscais: 0,
                    status: 'PENDENTE',
                    obs: ''
                }))
            })
        } catch (error) {
            toast({
                variant: 'destructive', title: 'Erro!',
                //@ts-ignore
                description: error?.response?.data?.message || error?.message || 'Erro ao tentar buscar as filiais!'
            })
        }
    }
    useEffect(() => {
        fetchFiliais()
        console.log('Fech filiais')
    }, [id_grupo_economico])

    useEffect(() => {
        window.ipcRenderer.on('UPDATE-GN-FILIAL', (event: any, data: any) => {
            updateGnFilial(data)
        })

        return () => {
            // @ts-ignore
            window.ipcRenderer.off('UPDATE-GN-FILIAL', () => { })
        }
    }, [])

    const btnIniciarDisabled = !(state.status == 'initial');
    const btnPararDisabled = !(state.status == 'running');
    const disabled = state.status == 'running';
    const readOnly = state.status == 'running';

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
                                    disabled={disabled}
                                    control={form.control}
                                    label="Grupo econômico"
                                    name="id_grupo_economico"
                                    options={[
                                        { value: '1', label: 'FACELL' },
                                        { value: '9', label: 'FORTTELECOM' },
                                    ]}
                                />

                                <FormSelect
                                    disabled={disabled}
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
                                    readOnly={readOnly}
                                    control={form.control}
                                    label="Data Inicial"
                                    name="data_inicial"
                                    type="date"
                                />
                                <FormInput
                                    readOnly={readOnly}
                                    control={form.control}
                                    label="Data Final"
                                    name="data_final"
                                    type="date"
                                />
                            </div>

                            <div className="flex gap-3">
                                <FormInput
                                    readOnly={readOnly}
                                    control={form.control}
                                    label="Token"
                                    name="token"
                                    placeholder="T900000"
                                />
                                <FormInput
                                    readOnly={readOnly}
                                    control={form.control}
                                    label="RSA"
                                    name="rsa"
                                    placeholder="000000"
                                />
                            </div>


                            <div className="flex gap-3">
                                <Button className="flex-1" disabled={btnIniciarDisabled} type="submit">Iniciar</Button>
                                <Button className="flex-1" onClick={handleClickParar} disabled={btnPararDisabled} type="button" variant={'destructive'}>Parar</Button>
                            </div>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}