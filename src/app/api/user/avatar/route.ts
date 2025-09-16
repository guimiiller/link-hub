// app/api/user/avatar/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { connectDB } from '@/lib/mongoose';
import User from '@/models/User';

export async function PUT(req: Request) {
  await connectDB();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { avatar } = await req.json();
  if (!avatar) {
    return NextResponse.json({ error: 'No avatar provided' }, { status: 400 });
  }

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  user.avatar = avatar;
  await user.save();

  return NextResponse.json({ message: 'Avatar updated successfully', avatar: user.avatar });
}


export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user.email });
  return NextResponse.json({ avatar: user?.avatar || '/avatars/default.png' });
}
