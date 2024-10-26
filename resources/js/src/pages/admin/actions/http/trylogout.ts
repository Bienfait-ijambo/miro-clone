import { makeHttpReq2 } from "../../../../helper/makeHttpReq"
import { showError } from "../../../../helper/toastnotification"

export async function tryLogoutUser() {
    try {
      await makeHttpReq2<{ userId: undefined }, { message: string }>('logout', 'POST', {
        userId: undefined
      })
    } catch (error) {
      showError((error as Error).message)
    }
  }