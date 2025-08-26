// Shared type definitions for the application

export interface User {
  id: string
  name: string | null
  email: string
}

export interface Item {
  id: string
  title: string
  notes: string | null
  position: number
  dueDate: Date | null
  createdAt: Date
  updatedAt: Date
  completedAt: Date | null
  completion?: Completion | null
}

export interface Completion {
  id: string
  photoPath: string
  caption: string | null
  createdAt: Date
  user: {
    id: string
    name: string | null
  }
}

export interface Pair {
  id: string
  members: Array<{
    user: User
  }>
  items: Item[]
}

export interface Invite {
  id: string
  code: string
  creator: User
  createdAt: Date
  expiresAt: Date
}
