import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const completeItemSchema = z.object({
  photoPath: z.string().min(1),
  caption: z.string().max(500).nullable().optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { photoPath, caption } = completeItemSchema.parse(body)

    // Check if item exists and user has access
    const existingItem = await prisma.item.findUnique({
      where: { id: params.id },
      include: {
        pair: {
          include: {
            members: {
              where: { userId: session.user.id }
            }
          }
        },
        completion: true
      }
    })

    if (!existingItem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 })
    }

    if (existingItem.pair.members.length === 0) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    if (existingItem.completion) {
      return NextResponse.json(
        { message: 'Item is already completed' },
        { status: 400 }
      )
    }

    // Complete the item with photo
    const [updatedItem] = await prisma.$transaction([
      prisma.item.update({
        where: { id: params.id },
        data: { 
          completedAt: new Date(),
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
      }),
      prisma.completion.create({
        data: {
          itemId: params.id,
          userId: session.user.id,
          photoPath,
          caption,
        }
      })
    ])

    // Fetch the item with completion data
    const itemWithCompletion = await prisma.item.findUnique({
      where: { id: params.id },
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

    return NextResponse.json(itemWithCompletion)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Complete item error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
