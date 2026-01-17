import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        created_at: true
      }
    })
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data pengguna' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const { name, email, password, role = 'customer' } = await request.json()
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const user = await prisma.user.create({
      data: {
        uuid: uuidv4(),  
        name,
        email,
        password_hash: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        created_at: true
      }
    })

    return NextResponse.json(
      { success: true, data: user },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Create user error:', error)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email sudah digunakan' },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Gagal membuat pengguna baru' },
      { status: 500 }
    )
  }
}