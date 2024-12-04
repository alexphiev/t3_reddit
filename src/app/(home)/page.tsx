import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { api, HydrateClient } from '@/trpc/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const posts = await api.post.getAll()
  console.log(posts)

  return (
    <HydrateClient>
      <div className="space-y-4 p-16 px-32">
        {posts?.map((post) => (
          <div key={post.id} className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{post.votes.length}</span>
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={'https://i.pravatar.cc/50'}
                  alt={'Author avatar'}
                />
                <AvatarFallback>{post.author.username}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                Posted by {post.author.username}
                {' - '}
                {post.createdAt.toLocaleDateString()}
              </span>
            </div>
            <h2 className="text-lg font-semibold">{post.title}</h2>
            <p className="text-sm text-muted-foreground">{post.content}</p>
          </div>
        ))}
      </div>
    </HydrateClient>
  )
}
