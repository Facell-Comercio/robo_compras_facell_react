import { CapturaGNFilial } from '@/@types/filial';
import { TypeSender } from '@/@types/util';
import { delay } from '../../../electron/helper/delay';
import { Page } from 'puppeteer';

export type CapturaFaturadosFilial = {
    page: Page,
    filiais: CapturaGNFilial[],
    data_inicial: Date,
    data_final: Date,
}
export async function capturaFaturadosFiliais(front:TypeSender, {
    page,
    filiais,
    data_inicial,
    data_final
}: CapturaFaturadosFilial) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto('https://ngn.timbrasil.com.br/#/invoices',
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


            const faturados = []
            for (var f of filiais) {
                var codSapTim = f['tim_cod_sap'].toString().padStart(10, '0')

                const codSapTimExistis = await targetFrame.evaluate((codSap) => {
                    const options = document.querySelectorAll('#ctl06_ddlClientes option');
                    // @ts-ignore
                    const indexCodSap = Array.from(options).findIndex(op => op.value.includes(String(codSap)))
                    return indexCodSap !== -1;
                }, f['tim_cod_sap']);

                if (!codSapTimExistis) {
                    front.send('FEEDBACK_GN', { type: 'success', text: `${f.nome} não existe no GN então pulamos..` })
                    front.send('UPDATE_FILIAL_GN', { id: f.id, faturados: 0 })
                    continue;
                }

                // Insere o código da loja
                await targetFrame.select('#ctl06_ddlClientes', codSapTim)
    
                await Promise.all([targetFrame.click('#ctl06_btnPesquisar'), targetFrame.waitForNavigation()])
                await delay(2000);
    
                const faturadosFilial = await targetFrame.evaluate(() => {
                    const rows = document.querySelectorAll('#ctl06_grdReport tbody tr');
                    return Array.from(rows, row => {
                        const columns = row.querySelectorAll('td');
                        return Array.from(columns, column => column.innerText);
                    });
                });
                front.send('FEEDBACK_GN', {type: 'success', text:`Coletamos ${faturadosFilial.length || 0} faturados da ${f.nome}`})
                front.send('UPDATE_FILIAL_GN', {id: f.id, faturados: faturadosFilial.length})

                faturados.push({
                    ...f,
                    data_inicial,
                    data_final,
                    faturados: faturadosFilial
                })
            }

            resolve(faturados)
        } catch (error) {
            reject(error)
        }
    })
}