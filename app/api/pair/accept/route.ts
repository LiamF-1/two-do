import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const acceptInviteSchema = z.object({
  code: z.string().min(6).max(6)
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { code } = acceptInviteSchema.parse(body)

    // Find the invite
    const invite = await prisma.invite.findUnique({
      where: { code },
      include: {
        pair: {
          include: {
            members: true
          }
        }
      }
    })

    if (!invite) {
      return NextResponse.json(
        { message: 'Invalid invite code' },
        { status: 404 }
      )
    }

    if (invite.usedAt) {
      return NextResponse.json(
        { message: 'This invite has already been used' },
        { status: 400 }
      )
    }

    if (invite.expiresAt < new Date()) {
      return NextResponse.json(
        { message: 'This invite has expired' },
        { status: 400 }
      )
    }

    if (invite.creatorId === session.user.id) {
      return NextResponse.json(
        { message: 'You cannot accept your own invite' },
        { status: 400 }
      )
    }

    if (!invite.pair) {
      return NextResponse.json(
        { message: 'Invalid invite - no pair found' },
        { status: 400 }
      )
    }

    // Check if user is already in this specific pair
    const existingMembership = await prisma.pairMember.findUnique({
      where: {
        userId_pairId: {
          userId: session.user.id,
          pairId: invite.pair.id
        }
      }
    })

    if (existingMembership) {
      return NextResponse.json(
        { message: 'You are already a member of this list' },
        { status: 400 }
      )
    }

    // Check if pair already has 2 members
    if (invite.pair.members.length >= 2) {
      return NextResponse.json(
        { message: 'This pair is already full' },
        { status: 400 }
      )
    }

    // Add user to the pair and mark invite as used
    await prisma.$transaction([
      prisma.pairMember.create({
        data: {
          userId: session.user.id,
          pairId: invite.pairId!,
          role: 'member'
        }
      }),
      prisma.invite.update({
        where: { id: invite.id },
        data: { usedAt: new Date() }
      })
    ])

    return NextResponse.json({ message: 'Successfully joined the pair!' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Accept invite error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
