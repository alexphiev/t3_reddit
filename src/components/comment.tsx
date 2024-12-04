'use client'

import { CommentForm } from '@/components/comment-form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getAvatarFallback } from '@/lib/utils'
import { type CommentWithReplies } from '@/types/comment.types'
import { type ClientUser } from '@/types/user.types'
import { MessageSquare } from 'lucide-react'
import { useState } from 'react'
import { format } from 'timeago.js'
import { VoteButtons } from './vote-buttons'
import { SignedIn } from '@clerk/nextjs'

interface CommentProps {
  comment: CommentWithReplies
  user: ClientUser | null
  postId: string
  level?: number
}

export function Comment({ comment, user, postId, level = 0 }: CommentProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  const { id, content, createdAt, author } = comment

  if (level > 0) {
    console.log(level, comment.id)
  }

  const indentation = level > 0 ? `pl-[32px]` : ''

  return (
    <div className={`py-4 ${indentation}`}>
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              {author.imageUrl && (
                <AvatarImage src={author.imageUrl} alt="Author avatar" />
              )}
              <AvatarFallback>
                {getAvatarFallback(author.firstName, author.lastName)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              Commented by {author.firstName} {author.lastName}{' '}
              {format(createdAt)}
            </span>
          </div>
          <p className="mt-2 text-sm">{content}</p>
          <div className="flex items-center gap-6">
            <VoteButtons
              userId={user?.id ?? undefined}
              id={id}
              type="comment"
            />
            <SignedIn>
              <Button
                variant="ghost"
                size="default"
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                <MessageSquare className="mr-1 h-4 w-4" />
                Reply
              </Button>
            </SignedIn>
          </div>
        </div>
      </div>

      {showReplyForm && (
        <div className="">
          <SignedIn>
            <CommentForm
              user={user}
              parentId={comment.id}
              postId={postId}
              onComment={() => setShowReplyForm(false)}
            />
          </SignedIn>
        </div>
      )}

      {comment.replies.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          user={user}
          postId={postId}
          level={level + 1}
        />
      ))}
    </div>
  )
}
