import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const updateItemSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  notes: z.string().max(1000).nullable().optional(),
  dueDate: z.string().nullable().optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const item = await prisma.item.findUnique({
      where: { id: params.id },
      include: {
        pair: {
          include: {
            members: {
              where: { userId: session.user.id }
            }
          }
        },
        completion: {
          include: {
            user: {
              select: { id: true, name: true }
            }
          }
        }
      }
    })

    if (!item) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 })
    }

    // Check if user is member of the pair
    if (item.pair.members.length === 0) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Get item error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const updateData = updateItemSchema.parse(body)

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
        }
      }
    })

    if (!existingItem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 })
    }

    if (existingItem.pair.members.length === 0) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    // Prepare update data
    const updatePayload: any = {}
    if (updateData.title !== undefined) updatePayload.title = updateData.title
    if (updateData.notes !== undefined) updatePayload.notes = updateData.notes
    if (updateData.dueDate !== undefined) {
      updatePayload.dueDate = updateData.dueDate ? new Date(updateData.dueDate) : null
    }

    const item = await prisma.item.update({
      where: { id: params.id },
      data: updatePayload,
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

    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Invalid input', errors: error.errors },
        { status: 400 }
      )
    }

    console.error('Update item error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

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
        }
      }
    })

    if (!existingItem) {
      return NextResponse.json({ message: 'Item not found' }, { status: 404 })
    }

    if (existingItem.pair.members.length === 0) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }

    await prisma.item.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Item deleted successfully' })
  } catch (error) {
    console.error('Delete item error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
