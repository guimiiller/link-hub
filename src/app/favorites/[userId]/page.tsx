import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import FavoritesClient from "@/components/FavoritesClient"

interface Props {
  params: {
    userId: string
  }
}

export default async function FavoritesPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  return <FavoritesClient />
}