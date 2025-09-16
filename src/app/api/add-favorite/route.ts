import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import User from '@/models/User';
import { connectDB } from '@/lib/mongoose';

export async function POST(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { link, category } = body;

  if (!link || !category) {
    return NextResponse.json({ error: 'Link and category are required' }, { status: 400 });
  }

  const user = await User.findOne({ email: session.user.email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Verifica duplicidade
  if (user.favorites?.some((fav: { link: string }) => fav.link === link)) {
    return NextResponse.json({ message: 'Link já existe' }, { status: 200 });
  }

  user.favorites.push({ link, category });
  await user.save();

  return NextResponse.json({ message: 'Favorito adicionado com sucesso' });
}
