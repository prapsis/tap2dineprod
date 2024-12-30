import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {toast} from 'sonner'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toastTrigger(message:string, type?:'success'|'warning'|'info'|'error'){
  switch(type){
    case 'success':
      toast.success(message)
      break;
    case 'error':
      toast.error(message)
      break;
    case 'info':
      toast.info(message)
      break;
    case 'warning':
      toast.warning(message)
      break;
    default:
      toast(message)
  }
}