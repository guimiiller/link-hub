import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import User from '@/models/User'
import { connectDB } from '@/lib/mongoose'

export async function POST(req: Request) {
  await connectDB()

  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { link } = body

  if (!link) {
    return NextResponse.json({ error: 'Link is required' }, { status: 400 })
  }

  const user = await User.findOne({ email: session.user.email })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  if (user.favorites?.includes(link)) {
    return NextResponse.json({ message: 'Link já existe' }, { status: 200 })
  }

  user.favorites = [...(user.favorites || []), link]
  await user.save()

  return NextResponse.json({ message: 'Favorito adicionado com sucesso' })
}
