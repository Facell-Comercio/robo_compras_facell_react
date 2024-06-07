import { TypeSender } from '@/@types/util'
import { Page } from 'puppeteer'

type LoginGN = {
    page: Page,
    credenciais: {
        token: string,
        rsa: string
    },
}
export async function loginGN(front: TypeSender, {
    page, credenciais,
}: LoginGN) {
    return new Promise(async (resolve, reject) => {

        try {
            if (!credenciais) {
                throw new Error()
            }
            const { token, rsa } = credenciais;
            if (!token || !rsa) {
                throw new Error('Token ou RSA não recebidos!')
            }
            page.goto('http://ngn.timbrasil.com.br/#/')
            await new Promise(resolve => setTimeout(resolve, 5000));

            page.waitForSelector('#username', { timeout: 60000 })

            await page.type('#username', token)
            // await page.keyboard.press('Enter')
            await page.type('#password', rsa)
            await page.keyboard.press('Enter')
            // await page.click('#signOnButton') 

            await new Promise(resolve => setTimeout(resolve, 4000));
            front.send('FEEDBACK_GN', {type: 'success', text: 'Login realizado! (aparentemente)'})
            resolve(true)
        } catch (error) {
            reject(error)
        }
    })
}

type LogoutProps = {
    page: Page
}
export async function logoutGN({ page }: LogoutProps) {
    return new Promise(async (resolve, reject) => {
        try {
            if (!page) {
                resolve(true)
            }
            // Desloga do NGN e aguarda 5 segundos 
            await page.goto('https://ngn.timbrasil.com.br/Login/logoff.html?TARGET=')
            setTimeout(() => {
                resolve(true)
            }, 5000)
        } catch (error) {
            reject(error)
        }
    })
}