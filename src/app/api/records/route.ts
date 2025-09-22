import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { searchParams } = new URL(request.url)

    const year = searchParams.get('year')
    const month = searchParams.get('month')
    const userId = searchParams.get('userId')
    const includeDemo = searchParams.get('includeDemo') === 'true'

    if (!year || !month || !userId) {
      return NextResponse.json(
        { error: 'Missing required parameters: year, month, userId' },
        { status: 400 }
      )
    }

    const startDate = `${year}-${month.padStart(2, '0')}-01`
    const lastDayOfMonth = new Date(parseInt(year), parseInt(month), 0).getDate()
    const endDate = `${year}-${month.padStart(2, '0')}-${lastDayOfMonth.toString().padStart(2, '0')}`

    let query = supabase
      .from('records')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (includeDemo) {
      // デモ用：現在のユーザーIDとtest-device-12345の両方のデータを取得
      query = query.in('user_id', [userId, 'test-device-12345'])
    } else {
      query = query.eq('user_id', userId)
    }

    const { data: records, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch records' },
        { status: 500 }
      )
    }

    // デモ用の場合、どのデータがテストデータかを明示
    const recordsWithDemoFlag = records?.map(record => ({
      ...record,
      isDemo: record.user_id === 'test-device-12345'
    })) || []

    return NextResponse.json({ records: recordsWithDemoFlag })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await request.json()

    const {
      user_id,
      date,
      photo_url,
      comment,
      steps,
      travel_time_minutes,
      transport_method,
      season_keyword,
      spot_name
    } = body

    if (!user_id || !date || !comment || !season_keyword || !spot_name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { data: record, error } = await supabase
      .from('records')
      .insert([{
        user_id,
        date,
        photo_url,
        comment,
        steps: steps || 0,
        travel_time_minutes: travel_time_minutes || 0,
        transport_method: transport_method || '1',
        season_keyword,
        spot_name,
        created_by: user_id,
        updated_by: user_id
      }])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to create record' },
        { status: 500 }
      )
    }

    return NextResponse.json({ record })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}