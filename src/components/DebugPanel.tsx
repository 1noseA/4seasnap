'use client'

import { useState, useEffect } from 'react'
import { clearDeviceId, getDeviceId } from '@/lib/deviceId'
import { useAuth } from '@/contexts/AuthContext'

export default function DebugPanel() {
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const resetUser = () => {
    clearDeviceId()
    window.location.reload()
  }

  const showDeviceInfo = () => {
    if (!mounted) return
    const currentDeviceId = getDeviceId()
    alert(`端末ID: ${currentDeviceId}\nユーザーID: ${user?.id || 'なし'}\nユーザー名: ${user?.user_name || 'なし'}`)
  }

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <div className="block w-full bg-gray-300 px-3 py-1 rounded text-xs">
          読み込み中...
        </div>
        <div className="block w-full bg-gray-300 px-3 py-1 rounded text-xs">
          読み込み中...
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      <button
        onClick={showDeviceInfo}
        className="block w-full bg-blue-500 text-white px-3 py-1 rounded text-xs"
      >
        端末ID確認
      </button>
      <button
        onClick={resetUser}
        className="block w-full bg-red-500 text-white px-3 py-1 rounded text-xs"
      >
        リセット
      </button>
    </div>
  )
}