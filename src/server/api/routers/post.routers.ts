import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const postRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        authorId: z.string().min(1),
        title: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          authorId: input.authorId,
          title: input.title,
          content: input.content,
        },
      })
    }),

  getLatest: publicProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.post.findFirst({
      orderBy: { createdAt: 'desc' },
    })

    return post ?? null
  }),
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({
      include: {
        author: true,
        votes: true,
      },
    })
  }),
})
