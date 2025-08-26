import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const createItemSchema = z.object({
  title: z.string().min(1).max(200),
  notes: z.string().max(1000).nullable().optional(),
  dueDate: z.string().nullable().optional(),
})

const reorderItemsSchema = z.object({
  pairId: z.string(),
  items: z.array(z.object({
    id: z.string(),
    position: z.number(),
  })),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, notes, dueDate } = createItemSchema.parse(body)

    // Get user's pair
    const membership = await prisma.pairMember.findFirst({
      where: { userId: session.user.id },
      include: { pair: true }
    })

    if (!membership) {
      return NextResponse.json(
        { message: 'You must be in a pair to create items' },
        { status: 400 }
      )
    }

    // Get the highest position
    const lastItem = await prisma.item.findFirst({
      where: { pairId: membership.pairId },
      orderBy: { position: 'desc' }
    })

    const nextPosition = (lastItem?.position ?? -1) + 1

    const item = await prisma.item.create({
      data: {
        title,
        notes,
        dueDate: dueDate ? new Date(dueDate) : null,
        position: nextPosition,
        pairId: membership.pairId,
      },
      include: {
        completion: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        }
      }
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Create item error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { pairId, items } = reorderItemsSchema.parse(body)

    // Verify user is member of the pair
    const membership = await prisma.pairMember.findFirst({
      where: { 
        userId: session.user.id,
        pairId: pairId 
      }
    })

    if (!membership) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Update positions in transaction
    await prisma.$transaction(
      items.map(item =>
        prisma.item.update({
          where: { id: item.id },
          data: { position: item.position }
        })
      )
    )

    return NextResponse.json({ message: 'Items reordered successfully' })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Reorder items error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
