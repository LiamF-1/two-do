import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { DashboardContent } from '@/components/dashboard-content'

async function getUserPair(userId: string) {
  const membership = await prisma.pairMember.findFirst({
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

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  const pair = await getUserPair(session.user.id)

  return (
    <div className="min-h-screen bg-background">
      <DashboardContent pair={pair} user={session.user} />
    </div>
  )
}
