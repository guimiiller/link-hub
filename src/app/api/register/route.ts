// api/register/route.ts
import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import User from "@/models/User"
import { connectDB } from "@/lib/mongoose"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { name, email, password } = await req.json()

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    const userExist = await User.findOne({ email })
    if (userExist) {
      return NextResponse.json({ error: "Usuário já existe" }, { status: 400 })
    }

    const hashedPassword = await hash(password, 10)
    const newUser = new User({ name, email, password: hashedPassword })
    await newUser.save()

    return NextResponse.json({
      message: "Usuário criado com sucesso",
      id: newUser._id.toString(),
    })
  } catch (err) {
    console.error("Register error:", err)
    return NextResponse.json({ error: "Erro no servidor" }, { status: 500 })
  }
}
