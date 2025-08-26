import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateInviteCode } from '@/lib/utils'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is already in a pair
    const existingMembership = await prisma.pairMember.findFirst({
      where: { userId: session.user.id }
    })

    if (existingMembership) {
      return NextResponse.json(
        { message: 'You are already in a pair' },
        { status: 400 }
      )
    }

    // Create new pair and invite
    const code = generateInviteCode()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    const pair = await prisma.pair.create({
      data: {
        members: {
          create: {
            userId: session.user.id,
            role: 'member'
          }
        }
      }
    })

    const invite = await prisma.invite.create({
      data: {
        code,
        creatorId: session.user.id,
        pairId: pair.id,
        expiresAt
      }
    })

    return NextResponse.json({ code: invite.code })
  } catch (error) {
    console.error('Create invite error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { message: 'Invite code is required' },
        { status: 400 }
      )
    }

    const invite = await prisma.invite.findUnique({
      where: { code },
      include: {
        creator: {
          select: { name: true, email: true }
        },
        pair: {
          include: {
            members: {
              include: {
                user: {
                  select: { name: true, email: true }
                }
              }
            }
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

    return NextResponse.json({
      invite: {
        code: invite.code,
        creator: invite.creator,
        createdAt: invite.createdAt,
        expiresAt: invite.expiresAt
      }
    })
  } catch (error) {
    console.error('Get invite error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
