import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface Post {
  id: number
  title: string
  description: string
  votes: number
  author: {
    name: string
    avatar: string
  }
  timeAgo: string
}

const posts: Post[] = [
  {
    id: 1,
    title: 'Honest opinions on Lime ebikes in London',
    description:
      'Tell me your good and bad experiences of using Lime as a Rider in London',
    votes: 105,
    author: {
      name: 'limerider',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    timeAgo: '3 hours ago',
  },
  {
    id: 2,
    title: 'Honest opinions on Lime ebikes in London',
    description:
      'Tell me your good and bad experiences of using Lime as a Rider in London',
    votes: 67,
    author: {
      name: 'limerider',
      avatar: '/placeholder.svg?height=32&width=32',
    },
    timeAgo: '4 hours ago',
  },
  // Add more posts as needed
]

export default function Home() {
  return (
    <div className="space-y-4 p-16 px-32">
      {posts.map((post) => (
        <div key={post.id} className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{post.votes}</span>
            <Avatar className="h-6 w-6">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Posted by {post.author.name} {post.timeAgo}
            </span>
          </div>
          <h2 className="text-lg font-semibold">{post.title}</h2>
          <p className="text-sm text-muted-foreground">{post.description}</p>
        </div>
      ))}
    </div>
  )
}
