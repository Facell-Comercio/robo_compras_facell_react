
import { CapturaGNFilial } from '@/@types/filial'
import { pupClose, pupInit } from '../pup'
import { loginGN } from './login'
import { capturaPedidosFiliais } from './pedidos/captura-pedidos-filiais'
import { IpcMainEvent, ipcMain } from 'electron'
import { capturaFaturadosFiliais } from './faturados/captura-faturados-filiais'
import { capturaPosicaoFinanceiraFiliais } from './posicao-financeira/captura-posicao-financeira-filiais'

type CapturaGN = {
    id_grupo_economico: string,
    filiais: CapturaGNFilial[],
    exibir_janela?: boolean,
    token: string,
    rsa: string,
    data_inicial: Date,
    data_final: Date,

}
export async function capturaGN(event: IpcMainEvent, {
    exibir_janela = false,
    filiais,
    id_grupo_economico,
    token, rsa,
    data_inicial,
    data_final,
}: CapturaGN) {
    const front = event.sender;
    // console.log('Dados recebidos', exibir_janela, id_grupo_economico, token, rsa, data_inicial, data_final)
    // console.log('Capturando GN...')
    let processing = true
    let browser: any = undefined;
    let page: any = undefined;

    ipcMain.on('STOP_GN', async () => {
        processing = false
        front.send('FEEDBACK_GN', { type: 'info', text: 'Processo encerrado manualmente!' })
        front.send('STATE_GN', { status: 'initial' })
        await pupClose({ browser, page })
    })

    while (processing) {
        if (!processing) break;


        try {
            if (!id_grupo_economico) {
                throw new Error('Grupo Econômico não informado!')
            }
            if (!token) {
                throw new Error('Matrícula TIM não informada!')
            }
            if (!rsa) {
                throw new Error('RSA TIM não informado!')
            }

            const credenciais = { token, rsa }
            // Obtenção de Browser e Page
            const { browser: newBrowser, page: newPage } = await pupInit({ headless: !exibir_janela })
            browser = newBrowser
            page = newPage;

            // Login no GN
            await loginGN(front, { page, credenciais })

            var dataInicialArray = data_inicial.toISOString().split('T')[0].split('-')
            var dataInicialFormatada = dataInicialArray[2] + '/' + dataInicialArray[1] + '/' + dataInicialArray[0]
            var dataFinalArray = data_final.toISOString().split('T')[0].split('-')
            var dataFinalFormatada = dataFinalArray[2] + '/' + dataFinalArray[1] + '/' + dataFinalArray[0]

            // Captura de Pedidos
            const pedidos = await capturaPedidosFiliais(front, {
                filiais,
                page,
                dataInicial: dataInicialFormatada,
                dataFinal: dataFinalFormatada
            })
            front.send('FEEDBACK_GN', { type: 'success', message: 'Pedidos capturados!' })

            // Captura de Faturados
            const faturados = await capturaFaturadosFiliais(front, {
                filiais,
                page,
                dataInicial: dataInicialFormatada,
                dataFinal: dataFinalFormatada
            })
            front.send('FEEDBACK_GN', { type: 'success', message: 'Pedidos Faturados capturados!' })

            // Captura de Posição Financeira
            const notas_fiscais = await capturaPosicaoFinanceiraFiliais(front, {
                filiais,
                page,
                dataInicial: dataInicialFormatada,
                dataFinal: dataFinalFormatada
            })
            front.send('FEEDBACK_GN', { type: 'success', message: 'Notas Fiscais da Posição Financeira capturadas!' })



        } catch (error) {
            front.send('FEEDBACK_GN')

        } finally {
            if (page || browser) {
                await pupClose({
                    page, browser
                })
            }
        }
        processing = false
    }
}