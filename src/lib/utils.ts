import { type CommentWithReplies } from '@/types/comment.types'
import { type Prisma } from '@prisma/client'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvatarFallback(
  firstName?: string | null,
  lastName?: string | null
) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`
}

/**
 * Organizes comments into a tree structure based on the replyToId.
 * @param comments - The unorganized comments.
 * @returns The comments organized into a tree structure.
 */
export function organizeComments(
  comments: Prisma.CommentGetPayload<{
    include: {
      author: true
      votes: true
    }
  }>[]
): CommentWithReplies[] {
  const commentMap = new Map<string, CommentWithReplies>()

  comments.forEach((comment) => {
    commentMap.set(comment.id, { ...comment, replies: [] })
  })

  const rootComments: CommentWithReplies[] = []

  commentMap.forEach((comment) => {
    if (comment.replyToId === null) {
      rootComments.push(comment)
    } else {
      const parentComment = commentMap.get(comment.replyToId)
      if (parentComment) {
        parentComment.replies.push(comment)
      }
    }
  })

  // Recursive function to sort replies at all levels
  const sortReplies = (comments: CommentWithReplies[]) => {
    comments.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    comments.forEach((comment) => {
      if (comment.replies.length > 0) {
        sortReplies(comment.replies)
      }
    })
    return comments
  }

  // Sort all comments recursively
  return sortReplies(rootComments)
}
