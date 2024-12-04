import { type Prisma } from '@prisma/client'

export type CommentWithReplies = Prisma.CommentGetPayload<{
  include: {
    author: true
    votes: true
  }
}> & {
  replies: CommentWithReplies[]
}
