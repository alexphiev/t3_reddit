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
  params: {
    id: string
  }
  searchParams: {
    previousUrl?: string
  }
}

export default async function PostPage({ params, searchParams }: PageProps) {
  const user = await currentUser()
  const clientUser: ClientUser | null = user
    ? {
        id: user.id,
        imageUrl: user.imageUrl,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
      }
    : null
  const post = await api.post.getById({ id: params.id })

  if (!post) {
    notFound()
  }

  const { author, comments, createdAt, title, content, votes } = post
  const organizedComments = organizeComments(comments)

  return (
    <div className="mx-auto w-full">
      <Link
        href={searchParams.previousUrl ?? '/'}
        className="mb-4 flex items-center gap-2 text-muted-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <PostCard post={post} userId={user?.id} />

      <div className="pt-4">
        <CommentForm user={clientUser} postId={params.id} />

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
                postId={params.id}
              />
              <Separator orientation="horizontal" className="mb-2" />
            </div>
          ))}
      </div>
    </div>
  )
}
