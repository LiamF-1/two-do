'use client'

import { useState } from 'react'
import { User } from 'next-auth'
import { Plus, Users, CheckCircle2, Clock, Sparkles, Settings, ArrowRight } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { CreateInviteDialog } from './create-invite-dialog'
import { AcceptInviteDialog } from './accept-invite-dialog'
import { UserSettingsDialog } from './user-settings-dialog'
import { HomePairMembership } from '@/types'
import Link from 'next/link'

interface HomeContentProps {
  pairs: HomePairMembership[]
  user: User
}

export function HomeContent({ pairs, user }: HomeContentProps) {
  const [showCreateInvite, setShowCreateInvite] = useState(false)
  const [showAcceptInvite, setShowAcceptInvite] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const activePairs = pairs.filter(membership => 
    membership.pair.items.some(item => !item.completedAt)
  )
  const completedPairs = pairs.filter(membership => 
    membership.pair.items.length > 0 && 
    membership.pair.items.every(item => item.completedAt)
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container-fluid max-w-7xl mx-auto py-8 space-y-8">
        {/* Header Section */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-glow">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background animate-pulse" />
                </div>
                <div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-gradient">
                    Your Adventures
                  </h1>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    Welcome back, <span className="font-medium text-foreground">{user.name || user.email}</span>
                  </p>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="self-start sm:self-center shadow-soft hover:shadow-glow transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Active Lists Section */}
        {activePairs.length > 0 && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Active Adventures</h2>
              <Badge variant="secondary" className="ml-auto">
                {activePairs.length} active
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {activePairs.map((membership, index) => {
                const activeItems = membership.pair.items.filter(item => !item.completedAt).length
                const completedItems = membership.pair.items.filter(item => item.completedAt).length
                const progress = membership.pair.items.length > 0 
                  ? (completedItems / membership.pair.items.length) * 100 
                  : 0
                
                return (
                  <Link
                    key={membership.id}
                    href={`/group/${membership.pair.id}`}
                    className="block group"
                  >
                    <Card className="relative overflow-hidden cursor-pointer shadow-soft hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02] border-2 border-primary/20 bg-gradient-to-br from-card via-card to-card/50 hover:border-primary/40">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <CardHeader className="pb-4 relative z-10">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2 flex-1">
                            <CardTitle className="text-xl group-hover:text-primary transition-colors duration-200">
                              {membership.pair.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Users className="w-4 h-4" />
                              <span>{membership.pair.members.length} member{membership.pair.members.length !== 1 ? 's' : ''}</span>
                            </div>
                          </div>
                          <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4 relative z-10">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="font-medium">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500 ease-out"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1 text-amber-600">
                              <Clock className="w-4 h-4" />
                              <span className="font-medium">{activeItems}</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                              <CheckCircle2 className="w-4 h-4" />
                              <span className="font-medium">{completedItems}</span>
                            </div>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200"
                          >
                            Active
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Completed Lists Section */}
        {completedPairs.length > 0 && (
          <div className="space-y-6 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Completed Adventures</h2>
              <Badge variant="outline" className="ml-auto border-green-200 text-green-700">
                {completedPairs.length} completed
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {completedPairs.map((membership) => (
                <Link
                  key={membership.id}
                  href={`/group/${membership.pair.id}`}
                  className="block group"
                >
                  <Card className="relative overflow-hidden cursor-pointer shadow-soft hover:shadow-glow transition-all duration-300 group-hover:scale-[1.02] border-2 border-green-200 bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 dark:from-green-950/20 dark:via-emerald-950/20 dark:to-green-950/20 hover:border-green-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="pb-4 relative z-10">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2 flex-1">
                          <CardTitle className="text-xl group-hover:text-green-700 transition-colors duration-200">
                            {membership.pair.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="w-4 h-4" />
                            <span>{membership.pair.members.length} member{membership.pair.members.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          {membership.pair.items.length} adventures completed
                        </div>
                        <Badge variant="outline" className="border-green-200 text-green-700 bg-green-50">
                          Complete
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Create New Adventure Section */}
        <div className="space-y-6 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Plus className="w-4 h-4 text-primary-foreground" />
            </div>
            <h2 className="text-2xl font-bold">Start New Adventure</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 max-w-2xl">
            <Card className="relative overflow-hidden group cursor-pointer shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 hover:border-primary/50">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent 
                className="p-6 relative z-10 cursor-pointer"
                onClick={() => setShowCreateInvite(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                    <Plus className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      Create New List
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Start a fresh adventure list and invite others to join
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group cursor-pointer shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] border-2 border-secondary/40 bg-gradient-to-br from-secondary/50 via-secondary/30 to-secondary/50 hover:border-secondary/60">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardContent 
                className="p-6 relative z-10 cursor-pointer"
                onClick={() => setShowAcceptInvite(true)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/80 flex items-center justify-center shadow-lg">
                    <Users className="w-6 h-6 text-secondary-foreground" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      Join Adventure
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Use an invite code to join an existing adventure list
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Empty State */}
        {pairs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 animate-slide-up">
            <div className="relative mb-8">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 flex items-center justify-center shadow-soft">
                <Sparkles className="w-16 h-16 text-primary/60" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-center space-y-4 max-w-md">
              <h3 className="text-2xl font-bold">Your Adventure Awaits!</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Ready to start your journey? Create your first adventure list or join someone else's to begin collecting unforgettable experiences.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button
                onClick={() => setShowCreateInvite(true)}
                className="shadow-soft hover:shadow-glow transition-all duration-200"
                size="lg"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Adventure List
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAcceptInvite(true)}
                className="shadow-soft hover:shadow-glow transition-all duration-200"
                size="lg"
              >
                <Users className="h-5 w-5 mr-2" />
                Join Adventure
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Dialogs */}
      <CreateInviteDialog
        open={showCreateInvite}
        onOpenChange={setShowCreateInvite}
      />
      <AcceptInviteDialog
        open={showAcceptInvite}
        onOpenChange={setShowAcceptInvite}
      />
      <UserSettingsDialog
        open={showSettings}
        onOpenChange={setShowSettings}
        user={user}
      />
    </div>
  )
}
