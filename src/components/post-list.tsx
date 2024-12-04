import { Separator } from '@/components/ui/separator'
import { SignedIn } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import { type Prisma } from '@prisma/client'
import { PostCard } from './post-card'
import { PostForm } from './post-form'

interface PostListProps {
  posts: Prisma.PostGetPayload<{ include: { author: true } }>[]
  previousUrl?: string
}

export async function PostList({ posts, previousUrl }: PostListProps) {
  const user = await currentUser()

  return (
    <div className="mx-auto flex w-full flex-col justify-start">
      <SignedIn>
        {user && <PostForm userId={user.id} userImageUrl={user.imageUrl} />}
      </SignedIn>
      {posts?.map((post, index) => (
        <div key={post.id}>
          <PostCard post={post} userId={user?.id} previousUrl={previousUrl} />
          {index < posts.length - 1 && (
            <Separator className="my-5 opacity-80" />
          )}
        </div>
      ))}
    </div>
  )
}
