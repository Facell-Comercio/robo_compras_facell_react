import { CapturaGNFilial } from '@/@types/filial';
import { delay } from 'electron/helper/delay';
import { Page } from 'puppeteer';

export type CapturaPosicaoFinanceiraFilial = {
    page: Page,
    filiais: CapturaGNFilial[],
    dataInicial: string,
    dataFinal: string,
}
export async function capturaPosicaoFinanceiraFiliais({
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
                notasFiscais.push({
                    filial: f,
                    notasFiscais: notasFiscaisFilial
                })
            }

            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}