import { makeHttpReq2 } from "../../../../helper/makeHttpReq"
import { showError, successMsg } from "../../../../helper/toastnotification"

export async function logout(userId:string| undefined) {
    try {

      
      const data = await makeHttpReq2<{ userId: number }, { message: string }>
      ('logout', 'POST', {
        userId: parseInt((userId as string))
      })
      window.location.href = '/app/login'
      localStorage.clear()
      successMsg(data.message)
    } catch (error) {
      showError((error as Error).message)
    }
  }
  
