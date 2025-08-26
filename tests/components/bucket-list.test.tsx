import { render, screen } from '@testing-library/react'
import { BucketList } from '@/components/bucket-list'

const mockItems = [
  {
    id: '1',
    title: 'Test Item 1',
    notes: 'Test notes',
    position: 0,
    dueDate: null,
    createdAt: new Date(),
    completedAt: null,
  },
  {
    id: '2',
    title: 'Test Item 2',
    notes: null,
    position: 1,
    dueDate: new Date(),
    createdAt: new Date(),
    completedAt: new Date(),
    completion: {
      id: 'comp1',
      photoPath: '/test.jpg',
      caption: 'Done!',
      createdAt: new Date(),
      user: {
        id: 'user1',
        name: 'Test User',
      },
    },
  },
]

describe('BucketList', () => {
  it('renders bucket list items', () => {
    render(
      <BucketList
        items={mockItems}
        pairId="pair1"
        currentUserId="user1"
      />
    )

    expect(screen.getByText('Test Item 1')).toBeInTheDocument()
    expect(screen.getByText('Test Item 2')).toBeInTheDocument()
    expect(screen.getByText('Test notes')).toBeInTheDocument()
  })

  it('shows empty state when no items', () => {
    render(
      <BucketList
        items={[]}
        pairId="pair1"
        currentUserId="user1"
      />
    )

    expect(screen.getByText('No items yet')).toBeInTheDocument()
    expect(screen.getByText('Start building your bucket list by adding your first item!')).toBeInTheDocument()
  })

  it('shows completion status', () => {
    render(
      <BucketList
        items={mockItems}
        pairId="pair1"
        currentUserId="user1"
      />
    )

    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByText('Done!')).toBeInTheDocument()
  })
})
