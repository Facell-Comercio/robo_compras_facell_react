import { ipcMain } from "electron"
import { capturaGN } from "./ngn/captura"

export function prepareHandlers(){
    ipcMain.on('CAPTURA-GN-INIT', async (event, data)=>{
        await capturaGN(event, data)
      }) 
}