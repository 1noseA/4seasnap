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
    const { device_id, user_name, profile_image } = await request.json()

    if (!device_id) {
      return NextResponse.json({ error: 'Device ID is required' }, { status: 400 })
    }

    if (user_name && user_name.length > 10) {
      return NextResponse.json({ error: 'User name must be 10 characters or less' }, { status: 400 })
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