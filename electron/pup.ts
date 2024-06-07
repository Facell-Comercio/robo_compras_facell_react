
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

const pup =require('puppeteer')
import { Browser, Page } from'puppeteer'

type pupInitProps = {
    headless: boolean
}
type PupInitReturn = {
    browser: Browser,
    page: Page
}
export async function pupInit({ headless = false }: pupInitProps): Promise<PupInitReturn> {
    return new Promise(async (resolve, reject) => {
        try {
            const browser: Browser = await pup.launch({
                ignoreDefaultArgs: ['--disable-extensions'],
                args: ['--incognito', "--no-sandbox",
                    "--disable-setuid-sandbox"],
                headless: headless ? true : false
            })
            const pages: Page[] = await browser.pages()
            const page: Page = pages.length > 0 ? pages[0] : await browser.newPage()

            resolve({
                browser, page
            })
        } catch (error) {
            reject(error)
        }
    })
}

type pupCloseProps = {
    browser?: Browser,
    page?: Page
}

export async function pupClose({ browser, page }: pupCloseProps) {
    return new Promise(async (resolve) => {
        try {
            if(page){
                await page.close();
            }
            if(browser){
                await browser.close();
            }

            resolve(true)
        } catch (error) {
            resolve(true)
        }
    })
}