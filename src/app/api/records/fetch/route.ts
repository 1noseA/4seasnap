import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey)
    const body = await request.json()

    const { user_id, year, month, include_demo } = body

    if (!user_id || !year || !month) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, year, month' },
        { status: 400 }
      )
    }

    const startDate = `${year}-${month.toString().padStart(2, '0')}-01`
    const lastDayOfMonth = new Date(parseInt(year), parseInt(month), 0).getDate()
    const endDate = `${year}-${month.toString().padStart(2, '0')}-${lastDayOfMonth.toString().padStart(2, '0')}`

    let query = supabase
      .from('records')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })

    if (include_demo) {
      // デモ用：現在のユーザーIDとクリーンテストユーザーUUIDの両方のデータを取得
      const cleanTestUserUuid = '7910c0b6-9f5d-4dee-bcaa-2fd69234e292'
      const userIds = [cleanTestUserUuid]

      // ダミーのuser_idでない場合のみ実際のuser_idも含める
      if (user_id !== 'demo-user-id') {
        userIds.push(user_id)
      }

      query = query.in('user_id', userIds)
    } else {
      query = query.eq('user_id', user_id)
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
    const cleanTestUserUuid = '7910c0b6-9f5d-4dee-bcaa-2fd69234e292'
    const recordsWithDemoFlag = records?.map(record => ({
      ...record,
      isDemo: record.user_id === cleanTestUserUuid
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