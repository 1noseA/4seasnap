import { v4 as uuidv4 } from 'uuid'

const DEVICE_ID_KEY = '4seasnap_device_id'

export const getDeviceId = (): string => {
  if (typeof window === 'undefined') {
    return ''
  }

  let deviceId = localStorage.getItem(DEVICE_ID_KEY)

  if (!deviceId) {
    deviceId = uuidv4()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }

  return deviceId
}

export const clearDeviceId = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(DEVICE_ID_KEY)
  }
}

export const setDeviceId = (deviceId: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
}