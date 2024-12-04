import { PostList } from '@/components/PostList'
import { api, HydrateClient } from '@/trpc/server'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const posts = await api.post.getAll()

  return (
    <HydrateClient>
      <PostList posts={posts} />
    </HydrateClient>
  )
}
