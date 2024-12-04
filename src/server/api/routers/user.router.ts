import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'

export const userRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        username: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.user.create({
        data: {
          id: input.id,
          username: input.username,
        },
      })
    }),
  getById: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: { id: input.id },
      })

      return user ?? null
    }),
})
