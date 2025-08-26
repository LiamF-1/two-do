import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Disable static generation - this page needs session access
export const dynamic = 'force-dynamic'

export default async function RootPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/login')
  }

  redirect('/home')
}
