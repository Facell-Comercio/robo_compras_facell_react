import { CapturaGNFilial } from '@/@types/filial';
import { TypeSender } from '@/@types/util';
import { delay } from '../../../electron/helper/delay';
import { Page } from 'puppeteer';

export type CapturaPosicaoFinanceiraFilial = {
    page: Page,
    filiais: CapturaGNFilial[]
}
export async function capturaPosicaoFinanceiraFiliais(front:TypeSender, {
    page,
    filiais,
}: CapturaPosicaoFinanceiraFilial) {
    return new Promise(async (resolve, reject) => {
        try {
            await page.goto('https://ngn.timbrasil.com.br/#/financial-status',
                { waitUntil: 'load', timeout: 0 })
            await delay(5000)

            let frames = page.frames();
            let targetFrame = null;
            // Itera sobre os iframes para encontrar o que contém o elemento desejado
            for (const frame of frames) {
                const elementHandle = await frame.$('#ctl06_ddlClientes');
                if (elementHandle) {
                    targetFrame = frame;
                    break;
                }
            }
            if(!targetFrame){
                throw new Error("Não foi possível localizar a área de pedidos!")
            }

            const notasFiscais = []
            for (var f of filiais) {
                var codSapTim = f['tim_cod_sap'].toString().padStart(10, '0')

                // Insere o código da loja
                await targetFrame.select('#ctl06_ddlClientes', codSapTim)
    
                await Promise.all([targetFrame.click('#ctl06_btnPesquisar'), targetFrame.waitForNavigation()])
                await delay(2000);
    
                const notasFiscaisFilial = await targetFrame.evaluate(() => {
                    const rows = document.querySelectorAll('#ctl06_grdReport tbody tr');
                    return Array.from(rows, row => {
                        const columns = row.querySelectorAll('td');
                        return Array.from(columns, column => column.innerText);
                    });
                });
                front.send('FEEDBACK_GN', {type: 'success', text:`Coletamos ${notasFiscaisFilial.length || 0} notas fiscais da ${f.nome}`})
                front.send('UPDATE_FILIAL_GN', {id: f.id, notasFiscais: notasFiscaisFilial.length})
                notasFiscais.push({
                    ...f,
                    notasFiscais: notasFiscaisFilial
                })
            }

            resolve(notasFiscais)
        } catch (error) {
            reject(error)
        }
    })
}