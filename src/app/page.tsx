'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Login from '@/components/Login'
import ProfileSetup from '@/components/ProfileSetup'
import Calendar from '@/components/Calendar'

export default function Home() {
  const { user, isLoading, isLoggedIn } = useAuth()
  const [showProfileSetup, setShowProfileSetup] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isLoading && user && mounted && isLoggedIn) {
      // 新規ユーザー（プロフィール未設定）の場合、プロフィール設定画面を表示
      if (!user.user_name && !user.profile_image) {
        setShowProfileSetup(true)
      }
    }
  }, [user, isLoading, mounted, isLoggedIn])

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-600">アプリを起動中...</div>
      </div>
    )
  }

  // ログインしていない場合はログイン画面を表示
  if (!isLoggedIn) {
    return <Login />
  }

  // 新規ユーザーの場合はプロフィール設定画面を表示
  if (showProfileSetup) {
    return <ProfileSetup />
  }

  // 既存ユーザーはカレンダー画面を表示
  return <Calendar />
}
