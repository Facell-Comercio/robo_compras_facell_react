import { getFiliais } from "@/api/filiais"
import { importNotasFiscais, pushCheckDatasys, pushCheckFinanceiro } from "@/api/notas-fiscais"
import { importPedidos } from "@/api/pedidos"
import { importFaturados } from "@/api/pedidos-faturados"
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
import { FaSpinner } from "react-icons/fa6"
import { z } from "zod"

export const ParametrosGN = () => {
    const state = useStoreCapturaGN().state;
    const setState = useStoreCapturaGN().setState;
    const updateGnFilial = useStoreCapturaGN().updateGnFilial;
    const pushFeedback = useStoreCapturaGN().pushFeedback

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
        if (state.filiais.length === 0) {
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

        window.ipcRenderer.send('START_GN', initialData)
        setState({ status: 'running' })
    }

    const handleClickParar = () => {
        window.ipcRenderer.send('STOP_GN')
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
                    notasFiscais: 0,
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
        if (state.status == 'initial') {
            fetchFiliais()
        }
    }, [id_grupo_economico])

    const handleImportDataGN = async (data: any) => {
        if (data.pedidos) {
            // * Importar os pedidos
            try {
                await importPedidos(data.pedidos)
                toast({
                    variant: 'success', title: 'Pedidos importados!'
                })
                pushFeedback({ type: 'success', text: 'Pedidos importados com sucesso!' })
            } catch (error) {
                // @ts-ignore
                pushFeedback({ type: 'error', text: error?.response?.data?.message || error?.message || 'Erro ao importar pedidos' })
            }
        }

        if (data.faturados) {
            // * Importar os faturados
            try {
                await importFaturados(data.faturados)
                toast({
                    variant: 'success', title: 'Faturados importados!'
                })
                pushFeedback({ type: 'success', text: 'Faturados importados com sucesso!' })
            } catch (error) {
                // @ts-ignore
                pushFeedback({ type: 'error', text: error?.response?.data?.message || error?.message || 'Erro ao importar faturados' })
            }
        }

        if (data.notasFiscais) {
            // * Importar as notas fiscais
            try {
                await importNotasFiscais(data.notasFiscais)
                toast({
                    variant: 'success', title: 'Posição financeira importada!'
                })
                pushFeedback({ type: 'success', text: 'Posição Financeira importada com sucesso!' })
            } catch (error) {
                // @ts-ignore
                pushFeedback({ type: 'error', text: error?.response?.data?.message || error?.message || 'Erro ao importar faturados' })
            }

            // * Solicitar o check Datasys
            try {
                await pushCheckDatasys({ id_grupo_economico })
                toast({
                    variant: 'success', title: 'Checagem de Recebimento Datasys Realizada!'
                })
                pushFeedback({ type: 'success', text: 'Checagem de recebimento Datasys realizada, agora vamos lançar as solicitações de pagamento ao financeiro!' })
            } catch (error) {
                // @ts-ignore
                pushFeedback({ type: 'error', text: error?.response?.data?.message || error?.message || 'Erro ao checar o fiscal do Datasys' })
            }

            // * Solicitar o lançamento Financeiro
            try {
                await pushCheckFinanceiro({ id_grupo_economico })
                toast({
                    variant: 'success', title: 'Lançamentos no financeiro realizados!'
                })
                pushFeedback({ type: 'success', text: 'Lançamentos no financeiro realizados!' })
            } catch (error) {
                // @ts-ignore
                pushFeedback({ type: 'error', text: error?.response?.data?.message || error?.message || 'Erro ao tentar lançar as solicitações ao financeiro' })
            }

            setState({ status: 'initial'})
        }
    }

    // * Handler
    useEffect(() => {
        // @ts-ignore
        const handleStateGn = (event: Electron.IpcRendererEvent, data: any) => {
            setState(data)
        }
        // @ts-ignore
        const handleUpdateFilialGn = (event: Electron.IpcRendererEvent, data: any) => {
            updateGnFilial(data)
        }
        // @ts-ignore
        const handleImportData = (event: Electron.IpcRendererEvent, data: any) => {
            handleImportDataGN(data)
        }

        window.ipcRenderer.on('STATE_GN', handleStateGn)
        window.ipcRenderer.on('UPDATE_FILIAL_GN', handleUpdateFilialGn)
        window.ipcRenderer.on('DADOS_CAPTURADOS_GN', handleImportData)

        return () => {
            window.ipcRenderer.off('STATE_GN', handleStateGn)
            window.ipcRenderer.off('UPDATE_FILIAL_GN', handleUpdateFilialGn)
            window.ipcRenderer.off('DADOS_CAPTURADOS_GN', handleImportData)
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

                            {state.status == 'processing' ? (
                                <Button variant={'warning'} className="flex-1" disabled={true} type="button">
                                    <FaSpinner size={18} className="animate-spin"/> 
                                    Processando os dados...
                                </Button>

                            ) : (
                                <div className="flex gap-3">
                                    <Button className="flex-1" disabled={btnIniciarDisabled} type="submit">Iniciar</Button>
                                    <Button className="flex-1" onClick={handleClickParar} disabled={btnPararDisabled} type="button" variant={'destructive'}>Parar</Button>
                                </div>

                            )}

                        </div>
                    </form>
                </Form>
            </CardContent >
        </Card >
    )
}