import { redirect, notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { GroupContent } from '@/components/group-content'

// Disable static generation - this page needs database access
export const dynamic = 'force-dynamic'

async function getUserPair(userId: string, pairId: string) {
  const membership = await prisma.pairMember.findUnique({
    where: {
      userId_pairId: {
        userId,
        pairId
      }
    },
    include: {
      pair: {
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                }
              }
            }
          },
          items: {
            include: {
              completion: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                    }
                  }
                }
              }
            },
            orderBy: { position: 'asc' }
          }
        }
      }
    }
  })

  return membership?.pair || null
}

interface GroupPageProps {
  params: {
    id: string
  }
}

export default async function GroupPage({ params }: GroupPageProps) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const pair = await getUserPair(session.user.id, params.id)
  
  if (!pair) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <GroupContent pair={pair} user={session.user} />
    </div>
  )
}
