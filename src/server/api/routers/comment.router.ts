import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc'

export const commentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        replyToId: z.string().nullable(),
        content: z.string().min(1),
        postId: z.string(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.comment.create({
        data: {
          authorId: input.authorId,
          postId: input.postId,
          replyToId: input.replyToId,
          content: input.content,
        },
      })
    }),
})
