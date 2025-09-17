import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { device_id } = await request.json()

    if (!device_id) {
      return NextResponse.json({ error: 'Device ID is required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('device_id', device_id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      console.error('User fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const requestData = await request.json()
    const { device_id, user_name, profile_image } = requestData

    console.log('PUT /api/auth/user called with:', {
      device_id,
      user_name,
      profile_image_length: profile_image ? profile_image.length : 0
    })

    if (!device_id) {
      console.error('Device ID is missing')
      return NextResponse.json({ error: 'Device ID is required' }, { status: 400 })
    }

    if (user_name && user_name.length > 10) {
      console.error('User name too long:', user_name)
      return NextResponse.json({ error: 'User name must be 10 characters or less' }, { status: 400 })
    }

    // プロフィール画像のサイズチェック（圧縮後でも100KB制限）
    if (profile_image && profile_image.length > 100000) {
      console.error('Profile image too large:', profile_image.length)
      return NextResponse.json({ error: 'Profile image is too large' }, { status: 400 })
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('device_id', device_id)
      .single()

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const { data, error } = await supabase
      .from('users')
      .update({
        user_name,
        profile_image,
        updated_by: existingUser.id,
        updated_at: new Date().toISOString()
      })
      .eq('device_id', device_id)
      .select()
      .single()

    if (error) {
      console.error('User update error:', error)
      return NextResponse.json({ error: 'Failed to update user' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}