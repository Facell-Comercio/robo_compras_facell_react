
import { CapturaGNFilial } from '@/@types/filial'
import { pupClose, pupInit } from '../pup'
import { loginGN } from './login'
import { capturaPedidosFiliais } from './pedidos/captura-pedidos-filiais'
import { BrowserWindow, Event, ipcMain } from 'electron'

type CapturaGN = {
    id_grupo_economico: string,
    filiais: CapturaGNFilial[],
    exibir_janela?: boolean,
    token: string,
    rsa: string,
    data_inicial: Date,
    data_final: Date,

}
export async function capturaGN(event: Event, {
    exibir_janela = false,
    filiais,
    id_grupo_economico,
    token, rsa,
    data_inicial,
    data_final,
}: CapturaGN) {
    return new Promise(async (resolve, reject) => {
        console.log('Dados recebidos', exibir_janela, id_grupo_economico, token, rsa, data_inicial, data_final)
        console.log('Capturando GN...')
        let processing = true
        
        ipcMain.on('STOP_GN', (event,_)=>{
            processing = false
        })
        
        let browser
        let page
        try {
            if(!win){
                throw new Error('Não foi possível acessar o BrowserWindow')
            }
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
            await loginGN({ page, credenciais })

            var dataInicialArray = data_inicial.toISOString().split('T')[0].split('-')
            var dataInicialFormatada = dataInicialArray[2] + '/' + dataInicialArray[1] + '/' + dataInicialArray[0]
            var dataFinalArray = data_final.toISOString().split('T')[0].split('-')
            var dataFinalFormatada = dataFinalArray[2] + '/' + dataFinalArray[1] + '/' + dataFinalArray[0]

            // Captura de Pedidos
            const pedidos = await capturaPedidosFiliais({
                filiais,
                page,
                dataInicial: dataInicialFormatada,
                dataFinal: dataFinalFormatada
            })

            win.webContents.send('FEEDBACK-GN', {type: 'success', message: 'Pedidos capturados!'})
            console.log('Pedidos finais', pedidos)


            resolve(true)
        } catch (error) {
            reject(error)
        } finally {
            if (page || browser) {
                await pupClose({
                    page, browser
                })
            }
        }
    })
}