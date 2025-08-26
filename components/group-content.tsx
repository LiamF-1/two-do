'use client'

import { useState } from 'react'
import { User } from 'next-auth'
import { Home, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from './ui/button'
import { PairHeader } from './pair-header'
import { BucketList } from './bucket-list'
import { Pair } from '@/types'

interface GroupContentProps {
  pair: Pair
  user: User
}

export function GroupContent({ pair, user }: GroupContentProps) {
  const partner = pair.members.find(member => member.user.id !== user.id)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container-fluid max-w-6xl mx-auto py-8 space-y-8">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link href="/home">
            <Button
              variant="outline"
              className="shadow-soft hover:shadow-glow transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Adventures
            </Button>
          </Link>
        </div>

        <PairHeader
          user={user}
          partner={partner?.user || null}
          itemCount={pair.items.length}
          completedCount={pair.items.filter(item => item.completedAt).length}
          pairName={pair.name}
        />
        
        <div className="animate-slide-up">
          <BucketList
            items={pair.items}
            pairId={pair.id}
            currentUserId={user.id}
          />
        </div>
      </div>
    </div>
  )
}
