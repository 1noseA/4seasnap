'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types'
import { getDeviceId, setDeviceId, generateDeviceId } from '@/lib/deviceId'

interface AuthContextType {
  user: User | null
  deviceId: string
  isLoading: boolean
  isLoggedIn: boolean
  login: () => Promise<void>
  logout: () => void
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
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // 既存のデバイスIDがあるかチェック
    const existingDeviceId = getDeviceId()
    if (existingDeviceId) {
      setDeviceIdState(existingDeviceId)
      checkExistingUser(existingDeviceId)
    } else {
      setIsLoading(false)
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

      let currentDeviceId = getDeviceId()

      // 既存の端末IDがある場合はそれを使用
      if (currentDeviceId) {
        const userResponse = await fetch('/api/auth/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ device_id: currentDeviceId }),
        })

        if (userResponse.ok) {
          // 既存ユーザーが見つかった場合
          const userData = await userResponse.json()
          setUser(userData)
          setDeviceIdState(currentDeviceId)
          setIsLoggedIn(true)
          return
        } else if (userResponse.status === 404) {
          // 端末IDはあるがユーザーが見つからない場合
          console.log('Device ID exists but user not found, creating new user with existing device ID')

          // 既存の端末IDで新規匿名ユーザーを作成
          const response = await fetch('/api/auth/anonymous', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ device_id: currentDeviceId }),
          })

          if (!response.ok) {
            throw new Error('Failed to create anonymous user')
          }

          // ユーザー情報を取得
          const newUserResponse = await fetch('/api/auth/user', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ device_id: currentDeviceId }),
          })

          if (newUserResponse.ok) {
            const userData = await newUserResponse.json()
            setUser(userData)
            setDeviceIdState(currentDeviceId)
            setIsLoggedIn(true)
            return
          }
        }
      }

      // 新規ユーザーまたは既存ユーザーが見つからない場合、新規作成
      const newDeviceId = generateDeviceId()

      const response = await fetch('/api/auth/anonymous', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ device_id: newDeviceId }),
      })

      if (!response.ok) {
        throw new Error('Failed to create anonymous user')
      }

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

  const logout = () => {
    setUser(null)
    setDeviceIdState('')
    setIsLoggedIn(false)
    setIsLoading(false)
    // 注意: 端末IDはlocalStorageに保持（再ログイン時に同じIDを使用）
  }

  const updateUser = async (userData: { user_name?: string; profile_image?: string }) => {
    try {
      console.log('Updating user with data:', userData)
      console.log('Device ID:', deviceId)

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

      console.log('Response status:', response.status)
      console.log('Response URL:', response.url)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('API error response:', errorData)
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
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}