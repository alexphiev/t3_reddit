import { CommentForm } from '@/components/comment-form'
import { Comment } from '@/components/comment'
import { PostCard } from '@/components/post-card'
import { organizeComments } from '@/lib/utils'
import { api } from '@/trpc/server'
import { currentUser } from '@clerk/nextjs/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { type ClientUser } from '@/types/user.types'
import { Separator } from '@/components/ui/separator'

interface PageProps {
  params: Promise<{ id: string }>
  searchParams: Promise<{ previousUrl?: string }>
}

export default async function PostPage({ params, searchParams }: PageProps) {
  const user = await currentUser()
  const id = (await params).id
  const previousUrl = (await searchParams).previousUrl
  const clientUser: ClientUser | null = user
    ? {
        id: user.id,
        imageUrl: user.imageUrl,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
      }
    : null
  const post = await api.post.getById({ id })

  if (!post) {
    notFound()
  }

  const organizedComments = organizeComments(post.comments)

  return (
    <div className="mx-auto w-full">
      <Link
        href={previousUrl ?? '/'}
        className="mb-4 flex items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <PostCard post={post} userId={user?.id} />

      <div className="pt-4">
        <CommentForm user={clientUser} postId={id} />

        <h2 className="mt-4 text-lg font-semibold">
          {organizedComments.length === 0 ? 'No comments yet' : 'All comments'}
        </h2>
        {organizedComments.length > 0 &&
          organizedComments.map((comment) => (
            <div key={comment.id}>
              <Comment
                key={comment.id}
                comment={comment}
                user={clientUser}
                postId={id}
              />
              <Separator orientation="horizontal" className="mb-2" />
            </div>
          ))}
      </div>
    </div>
  )
}
