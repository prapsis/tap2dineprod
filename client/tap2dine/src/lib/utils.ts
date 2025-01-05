import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {toast} from 'sonner'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toastTrigger(message:string, description?:string, type?:'success'|'warning'|'info'|'error'){
  switch(type){
    case 'success':
      toast.success(message,{description})
      break;
    case 'error':
      toast.error(message,{description})
      break;
    case 'info':
      toast.info(message,{description})
      break;
    case 'warning':
      toast.warning(message,{description})
      break;
    default:
      toast(message,{description})
  }
}