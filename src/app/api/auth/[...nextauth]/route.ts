import NextAuth from "next-auth"
import { authOptions } from "@/lib/authOptions" // ajuste o caminho se precisar

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
