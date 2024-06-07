import { ipcMain } from "electron"
import { capturaGN } from "./ngn/captura"

export function prepareHandlers(){
    ipcMain.on('START_GN', async (event, data)=>{
        capturaGN(event, data)
      }) 
}