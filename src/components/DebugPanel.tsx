'use client'

import { clearDeviceId } from '@/lib/deviceId'

export default function DebugPanel() {
  const resetUser = () => {
    clearDeviceId()
    window.location.reload()
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={resetUser}
        className="bg-red-500 text-white px-3 py-1 rounded text-xs"
      >
        リセット
      </button>
    </div>
  )
}