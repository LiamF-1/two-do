import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { HomeContent } from '@/components/home-content'

async function getUserPairs(userId: string) {
  const memberships = await prisma.pairMember.findMany({
    where: { userId },
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
            select: {
              id: true,
              completedAt: true,
            }
          }
        }
      }
    },
    orderBy: {
      pair: {
        updatedAt: 'desc'
      }
    }
  })

  return memberships.map(membership => ({
    id: membership.id,
    pair: {
      id: membership.pair.id,
      name: membership.pair.name,
      members: membership.pair.members,
      items: membership.pair.items
    }
  }))
}

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const pairMemberships = await getUserPairs(session.user.id)

  return (
    <div className="min-h-screen bg-background">
      <HomeContent pairs={pairMemberships} user={session.user} />
    </div>
  )
}
