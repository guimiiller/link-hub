import { NextResponse } from "next/server"
import { compare } from "bcryptjs"
import User from "@/models/User"
import { connectDB } from "@/lib/mongoose"

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Invalid email" }, { status: 401 })
    }

    const isValid = await compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    // Retorna no formato que o NextAuth espera
    return NextResponse.json({
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    })
  } catch (error) {
    console.error("Verify-user error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
