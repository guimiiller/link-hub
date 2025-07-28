import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import User from '@/models/User'
import { connectDB } from '@/lib/mongoose'

export async function PUT(req: Request) {
  await connectDB()

  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { oldLink, newLink } = await req.json()

  if (!oldLink || !newLink) {
    return NextResponse.json({ error: 'Links inválidos' }, { status: 400 })
  }

  const user = await User.findOne({ email: session.user.email })

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const index = user.favorites.indexOf(oldLink)
  if (index === -1) {
    return NextResponse.json({ error: 'Link não encontrado' }, { status: 404 })
  }

  user.favorites[index] = newLink
  await user.save()

  return NextResponse.json({ message: 'Link editado com sucesso' })
}
