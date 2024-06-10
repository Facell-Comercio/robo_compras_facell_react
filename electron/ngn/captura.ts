
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

            

            // Captura de Pedidos
            const pedidos = await capturaPedidosFiliais(front, {
                filiais,
                page,
                data_inicial,
                data_final
            })
            front.send('DADOS_CAPTURADOS_GN', {
                pedidos
            })
            front.send('FEEDBACK_GN', { type: 'success', text: 'Pedidos capturados!' })

            // Captura de Faturados
            const faturados = await capturaFaturadosFiliais(front, {
                filiais,
                page,
                data_inicial,
                data_final
            })
            front.send('DADOS_CAPTURADOS_GN', {
                faturados
            })
            front.send('FEEDBACK_GN', { type: 'success', text: 'Pedidos Faturados capturados!' })

            // Captura de Posição Financeira
            const notasFiscais = await capturaPosicaoFinanceiraFiliais(front, {
                filiais,
                page
            })
            front.send('FEEDBACK_GN', { type: 'success', text: 'Notas Fiscais da Posição Financeira capturadas!' })
            front.send('DADOS_CAPTURADOS_GN', {
                notasFiscais
            })


        } catch (error) {
            // @ts-ignore
            front.send('FEEDBACK_GN', {type: 'error', text: error?.message})

        } finally {
            front.send('STATE_GN', { status: 'processing' })
            if (page || browser) {
                await pupClose({
                    page, browser
                })
            }
        }
        processing = false
    }
}