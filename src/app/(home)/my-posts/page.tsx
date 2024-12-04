import { PostList } from '@/components/post-list'
import { api, HydrateClient } from '@/trpc/server'
import { currentUser } from '@clerk/nextjs/server'

export const dynamic = 'force-dynamic'

export default async function MyPosts() {
  const user = await currentUser()
  const posts = await api.post.getByAuthor({ authorId: user?.id ?? '' })

  return (
    <HydrateClient>
      <PostList posts={posts} previousUrl={'/my-posts'} />
    </HydrateClient>
  )
}
