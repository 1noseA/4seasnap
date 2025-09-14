import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST() {
  try {
    const { data: authData, error: authError } = await supabase.auth.signInAnonymously()

    if (authError) {
      console.error('Anonymous auth error:', authError)
      return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
    }

    const deviceId = uuidv4()

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        device_id: deviceId,
        created_by: authData.user.id,
        updated_by: authData.user.id
      })
      .select()
      .single()

    if (userError) {
      console.error('User creation error:', userError)
      return NextResponse.json({ error: 'User creation failed' }, { status: 500 })
    }

    return NextResponse.json({
      user_id: authData.user.id,
      device_id: deviceId,
      access_token: authData.session?.access_token
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}