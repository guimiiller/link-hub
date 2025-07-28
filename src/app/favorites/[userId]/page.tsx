import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import FavoritesClient from '@/components/FavoritesClient'

interface Props {
  params: {
    id: string
  }
}

export default async function FavoritesPage({ params }: Props) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return <FavoritesClient />
}
