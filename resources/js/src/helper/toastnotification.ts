
import { useToast } from 'vue-toast-notification'

const toast = useToast()

export function showError(message: string) {
  if (message === 'Not authenticated') {
    window.location.href = '/app/login'
    localStorage.clear()
  }
  toast.error(message, {
    position: 'bottom-right',
    duration: 4000,
    dismissible: true
  })
}

export function successMsg(message: string) {
  toast.success(message, {
    position: 'bottom-right',
    duration: 4000,
    dismissible: true
  })
}
