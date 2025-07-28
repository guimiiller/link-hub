import { NextResponse } from 'next/server'
import { compare } from 'bcryptjs'
import User from '@/models/User'
import { connectDB } from '@/lib/mongoose'

export async function POST(req: Request) {
  await connectDB()
  const { email, password } = await req.json()

  const user = await User.findOne({ email })
  if (!user) {
    return NextResponse.json({ error: 'email' }, { status: 401 })
  }

  const isValid = await compare(password, user.password) 
  if (!isValid) {
    return NextResponse.json({ error: 'password' }, { status: 401 })
  }

  return NextResponse.json({
    id: user._id,
    name: user.name,
    email: user.email
  })
}
