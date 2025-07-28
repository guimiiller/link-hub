import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import { connectDB } from '@/lib/mongoose'
import User from '@/models/User'

export async function POST(req: NextRequest) {
  await connectDB()

  const session = await getServerSession(authOptions)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { link } = await req.json()
  if (!link) {
    return NextResponse.json({ error: 'No link provided' }, { status: 400 })
  }

  const user = await User.findOne({ email: session.user.email })
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  user.favorites = user.favorites.filter((fav: string) => fav !== link)
  await user.save()

  return NextResponse.json({ favorites: user.favorites })
}
