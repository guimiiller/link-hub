import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/authOptions'
import User from '@/models/User'
import { connectDB } from '@/lib/mongoose'

export async function GET() {
  await connectDB()

  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await User.findOne({ email: session.user.email })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ favorites: user.favorites || [] })
}
