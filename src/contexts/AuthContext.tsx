'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types'
import { getDeviceId, setDeviceId } from '@/lib/deviceId'

interface AuthContextType {
  user: User | null
  deviceId: string
  isLoading: boolean
  isLoggedIn: boolean
  login: () => Promise<void>
  updateUser: (userData: { user_name?: string; profile_image?: string }) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [deviceId, setDeviceIdState] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 既存のデバイスIDがあるかチェック
    const existingDeviceId = getDeviceId()
    if (existingDeviceId) {
      checkExistingUser(existingDeviceId)
    }
  }, [])

  const checkExistingUser = async (deviceId: string) => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id: deviceId }),
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setDeviceIdState(deviceId)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Check existing user error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async () => {
    if (!mounted) return

    try {
      setIsLoading(true)

      // 新規匿名ユーザーを作成
      const response = await fetch('/api/auth/anonymous', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to create anonymous user')
      }

      const data = await response.json()
      const newDeviceId = data.device_id
      setDeviceId(newDeviceId)

      // ユーザー情報を取得
      const userResponse = await fetch('/api/auth/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id: newDeviceId }),
      })

      if (userResponse.ok) {
        const userData = await userResponse.json()
        setUser(userData)
        setDeviceIdState(newDeviceId)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = async (userData: { user_name?: string; profile_image?: string }) => {
    try {
      const response = await fetch('/api/auth/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_id: deviceId,
          ...userData,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update user')
      }

      const updatedUser = await response.json()
      setUser(updatedUser)
    } catch (error) {
      console.error('Update user error:', error)
      throw error
    }
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        deviceId,
        isLoading,
        isLoggedIn,
        login,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}