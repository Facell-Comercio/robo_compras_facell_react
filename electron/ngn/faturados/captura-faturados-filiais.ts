import { CapturaGNFilial } from '@/@types/filial';
import { delay } from 'electron/helper/delay';
import { Page } from 'puppeteer';

export type CapturaFaturadosFilial = {
    page: Page,
    filiais: CapturaGNFilial[],
    dataInicial: string,
    dataFinal: string,
}
export async function capturaFaturadosFiliais({
    page,
    filiais,
    dataInicial,
    dataFinal
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

            // @ts-ignore
            await targetFrame.$eval('#ctl06_txtDataInicio', el => el.value = '');
            // @ts-ignore
            await targetFrame.$eval('#ctl06_txtDataFim', el => el.value = '');
            // insere data inicial
            await targetFrame.type('#ctl06_txtDataInicio', dataInicial)
            // insere data final 
            await targetFrame.type('#ctl06_txtDataFim', dataFinal)


            const faturados = []
            for (var f of filiais) {
                var codSapTim = f['tim_cod_sap'].toString().padStart(10, '0')

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
                faturados.push({
                    filial: f,
                    faturados: faturadosFilial
                })
            }

            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}