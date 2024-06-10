import { CapturaGNFilial } from '@/@types/filial';
import { delay } from '../../../electron/helper/delay';
import { Page } from 'puppeteer';
import { TypeSender } from '@/@types/util';

export type CapturaPedidosFilial = {
    page: Page,
    filiais: CapturaGNFilial[],
    data_inicial: Date,
    data_final: Date,
}
export async function capturaPedidosFiliais(front:TypeSender, {
    page,
    filiais,
    data_inicial,
    data_final
}: CapturaPedidosFilial) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto('https://ngn.timbrasil.com.br/#/order-status',
                { waitUntil: 'load', timeout: 0 })
            await delay(5000)

            let frames = page.frames();
            let targetFrame = null;
            // Itera sobre os iframes para encontrar o que contém o elemento desejado
            for (const frame of frames) {
                const elementHandle = await frame.$('#ctl06_txtDataInicio');
                if (elementHandle) {
                    targetFrame = frame;
                    break;
                }
            }
            if(!targetFrame){
                throw new Error("Não foi possível localizar a área de pedidos!")
            }
            var dataInicialArray = data_inicial.toISOString().split('T')[0].split('-')
            var dataInicialFormatada = dataInicialArray[2] + '/' + dataInicialArray[1] + '/' + dataInicialArray[0]
            var dataFinalArray = data_final.toISOString().split('T')[0].split('-')
            var dataFinalFormatada = dataFinalArray[2] + '/' + dataFinalArray[1] + '/' + dataFinalArray[0]

            // @ts-ignore
            await targetFrame.$eval('#ctl06_txtDataInicio', el => el.value = '');
            // @ts-ignore
            await targetFrame.$eval('#ctl06_txtDataFim', el => el.value = '');
            // insere data inicial
            await targetFrame.type('#ctl06_txtDataInicio', dataInicialFormatada)
            // insere data final 
            await targetFrame.type('#ctl06_txtDataFim', dataFinalFormatada)


            const pedidos = []
            for (var f of filiais) {
                
                var codSapTim = f['tim_cod_sap'].toString().padStart(10, '0')

                // Insere o código da loja
                await targetFrame.select('#ctl06_ddlClientes', codSapTim)
    
                await Promise.all([targetFrame.click('#ctl06_btnPesquisar'), targetFrame.waitForNavigation()])
                await delay(2000);
    
                const pedidosFilial = await targetFrame.evaluate(() => {
                    const rows = document.querySelectorAll('#ctl06_grdReport tbody tr');
                    return Array.from(rows, row => {
                        const columns = row.querySelectorAll('td');
                        return Array.from(columns, column => column.innerText);
                    });
                });
                front.send('FEEDBACK_GN', {type: 'success', text:`Coletamos ${pedidosFilial.length || 0} pedidos da ${f.nome}`})
                front.send('UPDATE_FILIAL_GN', {id: f.id, pedidos: pedidosFilial.length})
                pedidos.push({
                    ...f,
                    data_inicial,
                    data_final,
                    pedidos: pedidosFilial
                })
            }

            resolve(pedidos)
        } catch (error) {
            reject(error)
        }
    })
}