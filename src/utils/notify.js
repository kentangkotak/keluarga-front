import mitt from 'mitt'

export const notifyEmitter = mitt()

export function notifySuccess(message, timeout = 2500) {
  notifyEmitter.emit('notify', {
    type: 'positive',
    message,
    timeout,
  })
}

export function notifyError(message, timeout = 3000) {
  notifyEmitter.emit('notify', {
    type: 'negative',
    message,
    timeout,
  })
}

export function notifyWarning(message, timeout = 2500) {
  notifyEmitter.emit('notify', {
    type: 'warning',
    message,
    timeout,
  })
}

export function notifyInfo(message, timeout = 2500) {
  notifyEmitter.emit('notify', {
    type: 'info',
    message,
    timeout,
  })
}

export default notifyEmitter
