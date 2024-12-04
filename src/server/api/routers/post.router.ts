import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from '@/server/api/trpc'

export const postRouter = createTRPCRouter({
  create: protectedProcedure
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
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.post.findMany({
      orderBy: { updatedAt: 'desc' },
      include: {
        author: true,
      },
    })
  }),
  getByAuthor: publicProcedure
    .input(z.object({ authorId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: { authorId: input.authorId },
        include: {
          author: true,
        },
        orderBy: { updatedAt: 'desc' },
      })
    }),
})
